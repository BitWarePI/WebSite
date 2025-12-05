const express = require('express');
const router = express.Router();

const dadosBucketController = require('../controllers/dadosBucketController');

router.get('/empresa/:id', dadosBucketController.lerEmpresa);

module.exports = router;
