const express = require('express');
const router = express.Router();
const path = require('path');

const dadosBucketController = require('../utils/getDadosBucket');

router.get('/dados/:arquivo', (req, res) => {
  dadosBucketController.lerArquivo(req, res);
});

router.get('/ver/:arquivo', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

module.exports = router;
