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

    console.log("Executando a instrução SQL: \n" + instrucaoSql, [empresaId]);
    return database.executar(instrucaoSql, [empresaId]);
}

function cadastrarFuncionario(nome, sobrenome, email, senha, cargo, empresaId) {
    // primeiro insere na tabela Usuario para obter o id (insertId)
    var instrucaoUsuario = `
        INSERT INTO Usuario (email, senha, data_cadastro)
        VALUES ('${email}', '${senha}', NOW());
    `;
    console.log("Executando a instrução SQL (usuario): \n" + instrucaoUsuario);
    console.log(nome, sobrenome, email, senha, cargo, empresaId);
    return database.executar(instrucaoUsuario)
        .then(result => {
            var usuarioId = result.insertId;
            var instrucaoFuncionario = `
                INSERT INTO Funcionario (nome, sobrenome, fkCargo, fkEmpresa, fkUsuario, validado)
                VALUES ('${nome}', '${sobrenome}', 
                        (SELECT idCargo FROM Cargo WHERE descricao = '${cargo}'), 
                        ${empresaId}, ${usuarioId}, 1);
            `;      
            console.log("Executando a instrução SQL (funcionario): \n" + instrucaoFuncionario);
            return database.executar(instrucaoFuncionario);
        })
        .catch(err => {
            console.error("Erro ao cadastrar funcionário:", err);
            throw err;
        });
}


module.exports = {
    listarFuncionariosPorEmpresa,
    cadastrarFuncionario
};