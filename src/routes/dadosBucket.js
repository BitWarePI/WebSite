const express = require('express');
const router = express.Router();
const path = require('path');

const dadosBucketController = require('../controllers/dadosBucketController');

router.get('/dados/:arquivo', dadosBucketController.lerArquivo);

router.get('/ver/:arquivo', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

module.exports = router;
