const { getS3FileContent } = require('../utilits/getCsvBucket');

async function buscarArquivoS3(req, res) {
    const { caminho } = req.params ;
    console.log('Caminho recebido:', caminho);
  try {
    console.log(`Requisição para buscar arquivo S3: ${caminho}`);

    if (!caminho) {
      return res.status(400).json({ erro: "Caminho do arquivo é obrigatório." });
    }

    const data = await getS3FileContent(caminho);
    return res.json(data);

  } catch (e) {
    return res.status(500).json({ erro: e.message });
  }
}

module.exports = { buscarArquivoS3 };