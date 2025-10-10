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
    ativarEmpresa,
    desativarEmpresa
};
