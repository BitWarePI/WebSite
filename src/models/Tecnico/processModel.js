const db = require('../../database/config');

function getMachineUse(fkEmpresa) {
  var instrucaoSql = `select count(idMaquina) as qtdMaquina
                      from Maquina 
                      where fkEmpresa = ${fkEmpresa};`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return db.executar(instrucaoSql);

}

function getAlertMachineUse(fkEmpresa) {
  var instrucaoSql = `SELECT COUNT(*) AS qtdAlertaRes
                      FROM Chamado cha
                      INNER JOIN Maquina maq 
                          ON cha.fkMaquina = maq.idMaquina
                      WHERE maq.fkEmpresa = ${fkEmpresa}
                        AND (
                              problema LIKE '%Uso de CPU%' 
                              OR problema LIKE '%Uso de GPU%'
                            );`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return db.executar(instrucaoSql);

}

function getCommandExecMachine(fkEmpresa) {
  var instrucaoSql = ``;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return db.executar(instrucaoSql);

}

function ListendMachine(fkEmpresa) {
  var instrucaoSql = `select 
                      maq.enderecoMac as addressMac, maq.nome as setor
                      from Maquina maq where fkEmpresa = ${fkEmpresa};`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

function getListCommandSnippt(fkEmpresa) {
  var instrucaoSql = `select * from comando_personalizado 
                      where fk_empresa = 1;`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

module.exports = {
  getMachineUse,
  getAlertMachineUse,
  getCommandExecMachine,
  ListendMachine,
  getListCommandSnippt
}