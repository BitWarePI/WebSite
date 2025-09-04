var database = require('../database/config');

function listarFuncionariosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT f.idFuncionario, f.nome, f.sobrenome, f.email, f.validado+0 AS estado,
               DATE_FORMAT(f.dataCadastro, "%d/%m/%Y") AS data_cadastro,
               c.descricao AS cargo
        FROM Funcionario f
        LEFT JOIN Cargo c ON f.fkCargo = c.idCargo
        WHERE f.fkEmpresa = ${empresaId}
        ORDER BY f.nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql, [empresaId]);
    return database.executar(instrucaoSql, [empresaId]);
}

function cadastrarFuncionario(nome, sobrenome, email, senha, cargo, empresaId) {
    var instrucaoFuncionario = `
        INSERT INTO Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa, validado)
        VALUES ('${nome}', '${sobrenome}', '${email}', '${senha}', 
        (SELECT idCargo FROM Cargo WHERE descricao = '${cargo}'), ${empresaId}, 1);
    `;      
    console.log("Executando a instrução SQL (funcionario): \n" + instrucaoFuncionario);
    return database.executar(instrucaoFuncionario);
}

function inativarFuncionario(funcionarioId) {
    var instrucaoSql = `
        UPDATE Funcionario 
        SET validado = 0
        WHERE idFuncionario = ${funcionarioId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ativarFuncionario(funcionarioId) {
    var instrucaoSql = `
        UPDATE Funcionario
        SET validado = 1
        WHERE idFuncionario = ${funcionarioId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    listarFuncionariosPorEmpresa,
    cadastrarFuncionario,
    inativarFuncionario,
    ativarFuncionario
};