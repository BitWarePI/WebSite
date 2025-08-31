var database = require('../database/config');

function listarFuncionariosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT u.id, u.nome, u.email, u.cpf,
               DATE_FORMAT(u.data_cadastro, "%d/%m/%Y") AS data_cadastro,
               c.nome AS cargo
        FROM usuarios u
        LEFT JOIN cargos c ON u.cargo_id = c.id
        WHERE u.empresa_id = ?
        ORDER BY u.nome
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

module.exports = {
    listarFuncionariosPorEmpresa
};