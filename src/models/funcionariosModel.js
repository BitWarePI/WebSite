var database = require('../database/config');

function listarFuncionariosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT u.idUsuario, f.nome, f.sobrenome, u.email, f.validado+0 AS estado,
               DATE_FORMAT(u.data_cadastro, "%d/%m/%Y") AS data_cadastro,
               c.descricao AS cargo
        FROM Usuario u
        INNER JOIN Funcionario f ON u.idUsuario = f.fkUsuario
        LEFT JOIN Cargo c ON f.fkCargo = c.idCargo
        WHERE f.fkEmpresa = ${empresaId}
        ORDER BY f.nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

module.exports = {
    listarFuncionariosPorEmpresa
};