var database = require('../database/config');

function atribuirTecnico(idChamado, idTecnico) {
    var instrucaoSql = `
        UPDATE Chamado 
        SET 
            idTecnico = ${idTecnico}, 
            status = 'Em andamento' 
        WHERE idChamado = ${idChamado};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarChamadosPorEmpresa(idEmpresa) {
    var instrucaoSql = `
     SELECT 
    c.idChamado, 
    m.enderecoMac,
    c.problema, 
    c.prioridade, 
    DATE_FORMAT(c.dataAbertura, "%d/%m/%Y") AS data_abertura,
    c.status,
    f.nome AS nomeTecnico,
    f.sobrenome AS sobrenomeTecnico,
    c.idTecnico
FROM Chamado c
JOIN Maquina m ON c.fkMaquina = m.idMaquina
LEFT JOIN Funcionario f ON c.idTecnico = f.idFuncionario
WHERE 
    m.fkEmpresa = ${idEmpresa}
    AND c.status != 'Resolvido'
ORDER BY 
    CASE c.prioridade WHEN 'Critica' THEN 1 
                       WHEN 'Alta' THEN 2 
                       WHEN 'Media' THEN 3 
                       WHEN 'Baixa' THEN 4 
                       ELSE 5 END,
    CASE c.status WHEN 'Aberto' THEN 1 ELSE 2 END,
    c.dataAbertura DESC
LIMIT 50;


    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function totalErros(idEmpresa) {
    const sql = `
SELECT COUNT(*) AS total_erros
FROM Chamado c
JOIN Maquina m ON c.fkMaquina = m.idMaquina
WHERE m.fkEmpresa = ${idEmpresa}
  AND c.status <> 'Resolvido';

  `;

    const resultado = await database.executar(sql);
    return resultado[0];
}

function maquinasComErro(idEmpresa) {
    const sql = `
    SELECT COUNT(DISTINCT m.idMaquina) AS maquinas_com_erro
    FROM Chamado c
    JOIN Maquina m ON c.fkMaquina = m.idMaquina
    WHERE m.fkEmpresa = ${idEmpresa}
      AND c.status <> 'Resolvido';
  `;

    return database.executar(sql);
}


function buscarKPIs(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            (SELECT COUNT(c.idChamado) 
             FROM Chamado c
             JOIN Maquina m ON c.fkMaquina = m.idMaquina
             WHERE m.fkEmpresa = ${idEmpresa} AND c.status = 'Aberto') AS pendentes,
             
            (SELECT COUNT(c.idChamado) 
             FROM Chamado c
             JOIN Maquina m ON c.fkMaquina = m.idMaquina
             WHERE m.fkEmpresa = ${idEmpresa} AND c.prioridade = 'Alta' AND c.status != 'Resolvido') AS criticos,
             
            (SELECT COUNT(DISTINCT m.idMaquina) 
             FROM Chamado c
             JOIN Maquina m ON c.fkMaquina = m.idMaquina
             WHERE m.fkEmpresa = ${idEmpresa} AND c.status != 'Resolvido') AS maquinasComProblema
        
        FROM Empresa 
        WHERE idEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL (KPIs): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarKPIsTecnico(idTecnico) {
    var instrucaoSql = `
        SELECT 
            (SELECT COUNT(idChamado) FROM Chamado 
             WHERE idTecnico = ${idTecnico} AND status = 'Aberto') AS pendentes,
             
            (SELECT COUNT(idChamado) FROM Chamado 
             WHERE idTecnico = ${idTecnico} AND prioridade = 'Alta' AND status != 'Resolvido') AS criticos,
             
            (SELECT COUNT(DISTINCT fkMaquina) FROM Chamado 
             WHERE idTecnico = ${idTecnico} AND status != 'Resolvido') AS maquinasComProblema
        
        FROM Funcionario WHERE idFuncionario = ${idTecnico};
    `;
    console.log("Executando a instrução SQL (KPIs Técnico): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarChamadosCriticos(fkEmpresa) {
    var instrucaoSql = `
            SELECT COUNT(*) AS totalCriticos
        FROM Chamado c
        JOIN Maquina m ON c.fkMaquina = m.idMaquina
        WHERE c.prioridade = 'Critica'
        AND m.fkEmpresa = ${fkEmpresa}
        AND c.status != 'Resolvido';
    `;

    console.log("Executando SQL (buscarChamadosCriticos):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function finalizarChamado(idChamado) {
    var instrucaoSql = `
        UPDATE Chamado 
        SET status = 'Resolvido'
        WHERE idChamado = ${idChamado};
    `;
    console.log("Executando a instrução SQL (Finalizar Chamado): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function removerTecnico(idChamado) {
    var instrucaoSql = `
        UPDATE Chamado 
        SET status = 'Aberto', idTecnico = NULL
        WHERE idChamado = ${idChamado};
    `;
    console.log("Executando a instrução SQL (Remover Técnico): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    atribuirTecnico,
    listarChamadosPorEmpresa,
    buscarKPIs,
    buscarKPIsTecnico,
    finalizarChamado,
    removerTecnico,
    buscarChamadosCriticos,
    totalErros,
    maquinasComErro
};