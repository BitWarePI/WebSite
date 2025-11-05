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

module.exports = {
    atribuirTecnico,
    listarChamadosPorEmpresa
};