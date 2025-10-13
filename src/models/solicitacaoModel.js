// src/models/solicitacaoModel.js

var database = require("../database/config");

// Lista todas as empresas que estão com 'ativo' = 0
function listarPendentes() {
    var instrucao = `
        SELECT idEmpresa, cnpj, nome, email, dtCadastro 
        FROM Empresa 
        WHERE CAST(ativo AS UNSIGNED) = 0
        ORDER BY dtCadastro ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Atualiza o campo 'ativo' para 1 (Aprovado)
function aprovar(idEmpresa) {
    var instrucao = `
        UPDATE Empresa SET ativo = 1 WHERE idEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Deleta a empresa do banco (Recusado)
function recusar(idEmpresa) {
    // CUIDADO: Garanta que tabelas como 'Funcionario' tenham ON DELETE CASCADE
    // ou trate a exclusão de funcionários antes de excluir a empresa.
    var instrucao = `
        DELETE FROM Empresa WHERE idEmpresa = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarPendentes,
    aprovar,
    recusar
};