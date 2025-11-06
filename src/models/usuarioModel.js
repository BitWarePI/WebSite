var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM Funcionario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, sobrenome, email, senha, fkCargo, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, fkEmpresa);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa) VALUES ('${nome}', '${sobrenome}', '${email}', '${senha}', '${fkCargo}', '${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function verificarEmpresa(fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function verificarEmpresa(): ", fkEmpresa);
    var instrucaoSql = `
        SELECT ativo FROM Empresa WHERE idEmpresa = ${fkEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function verificarSenhaAtual(idFuncionario, senhaAtual) {
    var instrucao = `
        SELECT * FROM Funcionario 
        WHERE idFuncionario = ${idFuncionario} 
        AND senha = '${senhaAtual}';
    `;
    return database.executar(instrucao);
}

function atualizarSenha(idFuncionario, novaSenha) {
    var instrucao = `
        UPDATE Funcionario 
        SET senha = '${novaSenha}' 
        WHERE idFuncionario = ${idFuncionario};
    `;
    return database.executar(instrucao);
}
module.exports = {
    autenticar,
    cadastrar,
    verificarEmpresa,
    verificarSenhaAtual,
    atualizarSenha
};