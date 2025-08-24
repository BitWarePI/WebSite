var database = require("../database/config")

function cadastrarCargo(descricao, fkEmpresa) {   
    var instrucaoSql = `
        INSERT INTO Cargo (descricao, fkEmpresa) VALUES ('${descricao}', '${fkEmpresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarCargo
};