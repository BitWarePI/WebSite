var express = require("express");
var router = express.Router();

var funcionariosController = require("../controllers/funcionariosController");

// Recebe GET /funcionarios/empresa/:id -> lista funcionários pela empresa
router.get("/empresa/:id", function (req, res) {
    funcionariosController.listarFuncionariosPorEmpresa(req, res);
});

router.get("/coletarDados/:id", function (req, res) {
    funcionariosController.coletarDados(req, res);
});

router.put("/editar/:id", function (req, res) {
    funcionariosController.editar(req, res);
});


router.post("/cadastrar", function (req, res) {
    funcionariosController.cadastrarFuncionario(req, res);
});

router.put("/inativar/:id", function (req, res) {
    funcionariosController.inativarFuncionario(req, res);
});

router.put("/ativar/:id", function (req, res) {
    funcionariosController.ativarFuncionario(req, res);
});

router.delete("/remover/:id", function (req, res) {
    funcionariosController.removerFuncionario(req, res);
});

router.delete("/funcionarios/:id", function (req, res) {
    funcionariosController.removerFuncionario(req, res);
});

router.get("/tecnicos/empresa/:idEmpresa", function (req, res) {
    funcionariosController.listarTecnicosPorEmpresa(req, res);
});

module.exports = router;