const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const Papa = require('papaparse');
const maquinaModel = require("../models/maquinaModel");

AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3();

async function getS3FileContent(pathFileKey) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION
  });

  const BucketClient = 's3-client-bitwarepi';
  
  if (!pathFileKey) {
    throw new Error('Path, caminho que se encontra o arquivo é obrigatório.');
  }

  const connection = {
    Bucket: BucketClient,
    Key: pathFileKey
  };

  console.log(`Lendo do S3: ${connection.Bucket} | ${connection.Key}`);

  try {
    const command = new GetObjectCommand(connection);
    const response = await s3Client.send(command);

    const text = await response.Body.transformToString('utf-8');
    const trimmedText = text.trim();

    let content;

    // Verifica se é JSON ou tenta CSV/PapaParse
    if (trimmedText.startsWith('[') || trimmedText.startsWith('{')) {
      content = JSON.parse(trimmedText);
      console.log(`Arquivo '${pathFileKey}' lido como JSON.`);

    } else {
      const parsed = Papa.parse(trimmedText, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true
      });
      content = parsed.data;
      console.log(`Arquivo '${pathFileKey}' lido como CSV.`);

    }

    // Retorna a string em JSON formatada
    // return JSON.stringify(content, null, 2);
    return content;

  } catch (err) {
    console.error('Erro ao buscar arquivo:', err.message);
    throw new Error(`Erro ao buscar arquivo '${pathFileKey}': ${err.message}`);
  }
}

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

module.exports = {
  getS3FileContent, lerCsv, getCsvFromEmpresa
};