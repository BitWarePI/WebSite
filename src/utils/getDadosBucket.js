const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const Papa = require('papaparse');

async function getS3FileContent(pathFileKey) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION
  });


  const BucketClient = 's3-client-bitwarepi777';
 
  if (!pathFileKey) {   
    throw new Error('Path é obrigatório.');
  }

  const connection = {
    Bucket: BucketClient,
    Key: pathFileKey
  };

  try {
    const command = new GetObjectCommand(connection);
    const response = await s3Client.send(command);
    const text = await response.Body.transformToString('utf-8');

    const parsed = Papa.parse(text.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true 
    });

    return parsed.data;

  } catch (err) {
    console.error('Erro S3:', err.message);
    throw err;
  }
}

module.exports = { getS3FileContent };