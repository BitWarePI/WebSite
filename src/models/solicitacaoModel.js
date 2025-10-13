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
    console.log(`Iniciando exclusão em cascata para Empresa ID: ${idEmpresa}`);

    // Passo 1: Deletar os registros dependentes na tabela 'Funcionario'
    const instrucaoDeleteFuncionarios = `
        DELETE FROM Funcionario WHERE fkEmpresa = ${idEmpresa};
    `;

    // Passo 2: Deletar o registro principal na tabela 'Empresa'
    const instrucaoDeleteEmpresa = `
        DELETE FROM Empresa WHERE idEmpresa = ${idEmpresa};
    `;

    // Executa a primeira instrução e, após sua conclusão, executa a segunda.
    return database.executar(instrucaoDeleteFuncionarios).then(resultado => {
        console.log(`Funcionários da empresa ${idEmpresa} deletados. Agora deletando a empresa.`);
        return database.executar(instrucaoDeleteEmpresa);
    });
}

module.exports = {
    listarPendentes,
    aprovar,
    recusar
};