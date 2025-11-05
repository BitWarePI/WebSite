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
            c.status,
            f.nome AS nomeTecnico,
            f.sobrenome AS sobrenomeTecnico
        FROM Chamado c
            JOIN Maquina m ON c.fkMaquina = m.idMaquina
            LEFT JOIN Funcionario f ON c.idTecnico = f.idFuncionario
        WHERE m.fkEmpresa = ${idEmpresa}
        ORDER BY 
            CASE c.status WHEN 'Aberto' THEN 1 ELSE 2 END, 
            c.dataAbertura DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
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

module.exports = {
    atribuirTecnico,
    listarChamadosPorEmpresa,
    buscarKPIs
};