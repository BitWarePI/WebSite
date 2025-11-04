var database = require("../database/config");

function cadastrarEmpresa(nomeEmpresaServer, cnpjServer, emailServer, senhaServer) {
    var instrucaoSqlEmpresa = `
        INSERT INTO bitware_db.Empresa (cnpj, nome, email)
        VALUES ('${cnpjServer}', '${nomeEmpresaServer}', '${emailServer}');
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
        .then((resultadoEmpresa) => {
            var idEmpresa = resultadoEmpresa.insertId;
            const fkCargo = 2;

            var instrucaoSqlFuncionario = `
                INSERT INTO bitware_db.Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa)
                VALUES ('Empresa', '${nomeEmpresaServer}', '${emailServer}', '${senhaServer}', ${fkCargo}, ${idEmpresa});
            `;

            console.log("Executando a instrução SQL do funcionário: \n" + instrucaoSqlFuncionario);

            return database.executar(instrucaoSqlFuncionario);
        });
}

function listarEmpresas(){
    var instrucaoSqlEmpresa = `
        select * from bitware_db.Empresa;
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}

function listarEmpresasAtivas(){
    var instrucaoSqlEmpresa = `
        select * from bitware_db.Empresa WHERE ativo = 1;
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}

function listarEmpresasInativas(){
    var instrucaoSqlEmpresa = `
        select * from bitware_db.Empresa WHERE ativo = 0;
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}


function carregarKPIS(){
    var instrucaoSqlEmpresa = `
        SELECT COUNT(*) as qtdEmpresas, SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as empresasAtivas, 
	    SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as solicitacoes FROM Empresa;
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}


function listarEmpresasDelecao(){
    var instrucaoSqlEmpresa = `
        select * from bitware_db.Empresa WHERE solicitouDelecao = 1;
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}

function aprovarSolicitacao(idEmpresa){
    var instrucaoSqlEmpresa = `
        DELETE FROM Empresa WHERE idEmpresa = ${idEmpresa};
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}


function negarSolicitacao(idEmpresa){
    var instrucaoSqlEmpresa = `
        UPDATE Empresa SET solicitouDelecao = 0 WHERE idEmpresa = ${idEmpresa};
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
}

function ativarEmpresa(idEmpresa){
    const id = Number(idEmpresa); // força número
    const sql = `
        UPDATE bitware_db.Empresa 
        SET ativo = 1 
        WHERE idEmpresa = ${id}
    `;
    return database.executar(sql);
}

function desativarEmpresa(idEmpresa) {
    const id = Number(idEmpresa); // força número
    const sql = `
        UPDATE bitware_db.Empresa 
        SET ativo = 0 
        WHERE idEmpresa = ${id}
    `;
    return database.executar(sql);
}


module.exports = {
    cadastrarEmpresa,
    listarEmpresas,
    carregarKPIS,
    listarEmpresasDelecao,
    listarEmpresasAtivas,
    listarEmpresasInativas,
    aprovarSolicitacao,
    negarSolicitacao,
    ativarEmpresa,
    desativarEmpresa
};
