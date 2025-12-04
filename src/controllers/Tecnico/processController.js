const model = require('../../models/Tecnico/processModel');
const { getS3FileContent } = require('../../utils/getDadosBucket');

async function getInfoKpis(req, res) {
  const { fkEmpresa } = req.params;

  if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
    return res.status(400).send("Valor inválido de fkEmpresa!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {

    const qtdMaquinaRes = await model.getMachineUse(fkEmpresa);
    console.log("qtdMaquinaRes res: " + qtdMaquinaRes[0]);

    const qtdAlertaRes = await model.getAlertMachineUse(fkEmpresa);
    console.log("qtdAlertaRes res: ", qtdAlertaRes[0]);

    const qtdScriptsRes  = await model.getCommandExecMachine(fkEmpresa);
    console.log("qtdScriptsRes  res: " + qtdScriptsRes[0]);

    // ? evita quebrar o codigo se vier vazio o array
    // ?? só ativa quando o valor é null ou undefined
    return res.json({
      qtdMaquinaRes: qtdMaquinaRes[0]?.qtdMaquina ?? 0,
      alertasUsoRes: qtdAlertaRes[0]?.qtdAlertaRes ?? 0,
      scriptsExecutadosRes: qtdScriptsRes[0]?.qtdScriptsRes ?? 0
    });

  } catch (error) {
    console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}

async function listendInfoMachine(req, res) {
  const { fkEmpresa } = req.params;

  if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
    return res.status(400).send("Valor inválido de fkEmpresa!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {

    const listaDeMaquinas = await model.ListendMachine(fkEmpresa);
    console.log("listaDeMaquinas ", listaDeMaquinas);

    const pathFileKey = `${fkEmpresa}/hardware.csv`;
    const getInfoMachine = await getS3FileContent(pathFileKey);
    console.log("getInfoMachine ", getInfoMachine);

    const listaDeMaquinasProntas = listaDeMaquinas.map((maquina) => {
      // Comparando addressMac (banco) com macAddress (S3)
      const infoS3 = getInfoMachine.find(info => info.macAddress === maquina.addressMac);

      if (infoS3) {
        return {
          addressMac: maquina.addressMac,
          setor: maquina.setor,
          so: infoS3.so,
          status: "online",
        };
      } else {
        return {
          addressMac: maquina.addressMac,
          setor: maquina.setor,
          so: "Desativada",
          status: "offline"
        };
      }
    });

    console.log("Resul Final:", listaDeMaquinasProntas);
    return res.json(listaDeMaquinasProntas);

  } catch (error) {
    console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}

async function getListCommandSnippt(req, res) {
  const { fkEmpresa } = req.params;

  if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
    return res.status(400).send("Valor inválido de fkEmpresa!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {
    const listCommand = await model.getListCommandSnippt(fkEmpresa);
    console.log("listCommand ", listCommand);

    return res.json(listCommand);

  } catch (error) {
    console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}

async function posListCommandSnippt(req, res) {
  const { fkEmpresa } = req.params;
  const { nameCommand, command } = req.body;

  if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
    return res.status(400).send("Valor inválido de fkEmpresa!");
  }

  if (!command || command.trim() === "") {
    return res.status(400).send("Comando é obrigatório!");
  }

  if (!nameCommand || nameCommand.trim() === "") {
    return res.status(400).send("Nome do comando é obrigatório!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {
    const resultado = await model.createCommandSnippt(fkEmpresa, nameCommand, command);
    console.log("Comando criado:", resultado);

    return res.json({
      id: resultado.insertId,
      nameCommand: nameCommand,
      fkEmpresa: fkEmpresa,
      command: command,
      mensagem: "Comando criado com sucesso"
    });

  } catch (error) {
    console.log("Houve um erro ao criar o comando!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}

async function putListCommandSnippt(req, res) {
  const { id } = req.params;
  const { nameCommand, command } = req.body;

  if (id === undefined || isNaN(id)) {
    return res.status(400).send("Valor inválido de id!");
  }

  if (!command || command.trim() === "") {
    return res.status(400).send("Comando é obrigatório!");
  }

  if (!nameCommand || nameCommand.trim() === "") {
    return res.status(400).send("Nome do comando é obrigatório!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {
    const resultado = await model.updateCommandSnippt(id, nameCommand, command);
    console.log("Comando atualizado:", resultado);

    if (resultado.affectedRows === 0) {
      return res.status(404).send("Comando não encontrado!");
    }

    return res.json({
      id: id,
      nameCommand: nameCommand,
      command: command,
      mensagem: "Comando atualizado com sucesso"
    });
    
  } catch (error) {
    console.log("Houve um erro ao atualizar o comando!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}

async function deleteListCommandSnippt(req, res) {
  const { id } = req.params;

  if (id === undefined || isNaN(id)) {
    return res.status(400).send("Valor inválido de id!");
  }

  console.log(`Rota acessada: ${req.method} | ${req.path}`);

  try {
    const resultado = await model.deleteCommandSnippt(id);
    console.log("Comando deletado:", resultado);

    if (resultado.affectedRows === 0) {
      return res.status(404).send("Comando não encontrado!");
    }

    return res.json({
      id: id,
      mensagem: "Comando deletado com sucesso"
    });

  } catch (error) {
    console.log("Houve um erro ao deletar o comando!", error.sqlMessage || error);
    return res.status(500).json({
      erro: error.sqlMessage || "Erro interno"
    });
  }
}



module.exports = {
  getInfoKpis,
  listendInfoMachine,
  getListCommandSnippt,
  posListCommandSnippt,
  putListCommandSnippt,
  deleteListCommandSnippt
}