var database = require("../database/config");

function cadastrarEmpresa(nomeEmpresaServer, cnpjServer, emailServer, senhaServer) {


    var instrucaoSqlEmpresa = `
        INSERT INTO bitware_db.Empresa (cnpj, nome)
        VALUES ('${cnpjServer}', '${nomeEmpresaServer}');
    `;

    console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

    return database.executar(instrucaoSqlEmpresa)
        .then((resultadoEmpresa) => {
            var idEmpresa = resultadoEmpresa.insertId;
            const fkCargo = 1;

            var instrucaoSqlFuncionario = `
                INSERT INTO bitware_db.Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa)
                VALUES ('Admin', '${nomeEmpresaServer}', '${emailServer}', '${senhaServer}', ${fkCargo}, ${idEmpresa});
            `;

            console.log("Executando a instrução SQL do funcionário: \n" + instrucaoSqlFuncionario);

            return database.executar(instrucaoSqlFuncionario);
        });
}

module.exports = {
    cadastrarEmpresa
};
