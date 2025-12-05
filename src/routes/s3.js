const express = require('express');
const router = express.Router();
const s3Controller = require("../controllers/s3Controller");

router.get('/arquivo/:empresa/:arquivo', s3Controller.buscarArquivoS3);
router.get("/pegarDadosMaquinasClient/:idEmpresa", s3Controller.pegarCsvMaquinas);
router.get("/pegarCsvMedias/:idEmpresa", s3Controller.pegarCsvMedias);
router.get("/pegarDadosClient/:idEmpresa/:macAddress", s3Controller.pegarCsvPorMaquina);
router.get("/pegarLeiturasFormatadas/:idEmpresa/", s3Controller.pegarLeiturasFormatadas);

module.exports = router;