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
  var instrucaoSql = `select
                      id,
                      cp.nome as nameCommand,
                      cp.comando as commandSnippt
                      from comando_personalizado cp
                      where fk_empresa = ${fkEmpresa};`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

function createCommandSnippt(fkEmpresa, nameCommand) {
  var instrucaoSql = `INSERT INTO comando_personalizado (nome, fk_empresa) 
                      VALUES ('${nameCommand}', ${fkEmpresa});`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

function updateCommandSnippt(id, nameCommand) {
  var instrucaoSql = `UPDATE comando_personalizado 
                      SET nome = '${nameCommand}' 
                      WHERE id = ${id};`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

function deleteCommandSnippt(id) {
  var instrucaoSql = `DELETE FROM comando_personalizado 
                      WHERE id = ${id};`;

  console.log("Executando a instrução SQL: \n", instrucaoSql);
  return db.executar(instrucaoSql);

}

module.exports = {
  getMachineUse,
  getAlertMachineUse,
  getCommandExecMachine,
  ListendMachine,
  getListCommandSnippt,
  createCommandSnippt,
  updateCommandSnippt,
  deleteCommandSnippt
}