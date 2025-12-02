const express = require('express');
const router = express.Router();

const dadosBucketController = require('../controllers/dadosBucketController');

router.get('/dados/:arquivo', dadosBucketController.lerArquivo);

module.exports = router;
