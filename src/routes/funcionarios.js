var express = require("express");
var router = express.Router();

var funcionariosController = require("../controllers/funcionariosController");

// Recebe GET /funcionarios/empresa/:id -> lista funcionários pela empresa
router.get("/empresa/:id", function (req, res) {
    funcionariosController.listarFuncionariosPorEmpresa(req, res);
});

module.exports = router;