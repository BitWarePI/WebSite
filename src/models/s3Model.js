const database = require("../database/config");

function maquinasPorEmpresa(idEmpresa){
    const instrucaoSQL = `
       SELECT enderecoMac FROM Maquina WHERE fkEmpresa = ${idEmpresa}
    `
    return database.executar(instrucaoSQL)
}

module.exports = {
    maquinasPorEmpresa
};