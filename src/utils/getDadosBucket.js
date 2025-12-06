const AWS = require('aws-sdk');
const Papa = require('papaparse');
const maquinaModel = require("../models/maquinaModel");

AWS.config.update({ region: process.env.AWS_REGION });  
const s3 = new AWS.S3();

async function lerCsv(bucket, key) {
  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  const texto = data.Body.toString("utf-8");

  return Papa.parse(texto, {
    header: true,
    delimiter: texto.includes(";") ? ";" : ",",
    skipEmptyLines: true
  }).data;
}

async function getCsvFromEmpresa(idEmpresa) {
  const bucket = process.env.S3_BUCKET;

  const macsDb = await maquinaModel.buscarMacsDaEmpresa(idEmpresa);
  if (!macsDb.length) return [];


  const macs = macsDb.map(m => m.enderecoMac);

  const resultados = [];

  for (const mac of macs) {
    const key = `${idEmpresa}/maquinas/${mac}.csv`;

    try {
      console.log("Lendo arquivo:", key);
      const dados = await lerCsv(bucket, key);

      resultados.push({
        maquina: mac,
        arquivo: key,
        dados
      });

    } catch (err) {
      console.log("Arquivo não encontrado:", key);
      continue;
    }
  }

  return resultados;
}

module.exports = { getCsvFromEmpresa };
