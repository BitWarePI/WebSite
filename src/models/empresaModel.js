var database = require("../database/config");

function cadastrarEmpresa(nomeEmpresaServer, cnpjServer, emailServer, senhaServer) {    
    var nivelAcesso = 1;

    var instrucaoSqlUsuario = `
        INSERT INTO bitware_db.Usuario (email, senha, nivelAcesso)
        VALUES ('${emailServer}', '${senhaServer}', ${nivelAcesso});
    `;

    console.log("Executando a instrução SQL do usuário: \n" + instrucaoSqlUsuario);

    return database.executar(instrucaoSqlUsuario)
        .then((resultadoUsuario) => {
            var idUsuario = resultadoUsuario.insertId;

            var instrucaoSqlEmpresa = `
                INSERT INTO bitware_db.Empresa (cnpj, nome, fkUsuario)
                VALUES ('${cnpjServer}', '${nomeEmpresaServer}', ${idUsuario});
            `;

            console.log("Executando a instrução SQL da empresa: \n" + instrucaoSqlEmpresa);

            return database.executar(instrucaoSqlEmpresa);
        });
}

module.exports = {
    cadastrarEmpresa
};
