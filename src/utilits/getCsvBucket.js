const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const Papa = require('papaparse');

async function getS3FileContent(pathFileKey) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION
  });

  const BucketClient = 's3-client-bitwarepi-isaak';
 
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


module.exports = {
  getS3FileContent
};