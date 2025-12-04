var express = require("express");
var router = express.Router();
var { getS3FileContent } = require("../utils/getDadosBucket"); 

router.get("/buscar-dados-csv", async function (req, res) {

    const fileKey = 'teste.csv'; 

    try {
        const dados = await getS3FileContent(fileKey);
        res.status(200).json(dados);
    } catch (erro) {
        console.error("Erro ao buscar dados do S3:", erro);
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;