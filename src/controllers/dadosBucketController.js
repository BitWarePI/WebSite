const { getS3FileContent } = require('../utils/getDadosBucket');

async function lerArquivo(req, res) {
  try {
    const { arquivo } = req.params;
    const jsonString = await getS3FileContent(arquivo);
    res.json(JSON.parse(jsonString)); // já retorna JSON direto para o front
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { lerArquivo };