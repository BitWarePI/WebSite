const express = require('express');
const router = express.Router();
const s3Controller = require("../controllers/S3Controller");

router.get('/arquivo/:empresa/:arquivo', s3Controller.buscarArquivoS3);

module.exports = router;