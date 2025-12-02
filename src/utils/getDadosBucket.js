const AWS = require('aws-sdk');
const Papa = require('papaparse');

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

async function getS3FileContent(fileKey) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    // detectar CSV ou JSON automáticamente
    if (text.startsWith('{') || text.startsWith('[')) {
      return text; // JSON puro
    } else {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(';') ? ';' : ',',
        skipEmptyLines: true
      });

      return JSON.stringify(parsed.data); // JSON convertido
    }

  } catch (err) {
    throw new Error("S3 error: " + err.message);
  }
}

module.exports = { getS3FileContent };
