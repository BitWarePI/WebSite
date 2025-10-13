var express = require("express");
var router = express.Router();

var solicitacaoController = require("../controllers/solicitacaoController");

// Rota para buscar todas as empresas com status 'ativo' = 0 (pendentes)
router.get("/listarPendentes", function (req, res) {
    solicitacaoController.listarPendentes(req, res);
});

// Rota para aprovar uma empresa (mudar 'ativo' para 1)
router.put("/aprovar/:idEmpresa", function (req, res) {
    solicitacaoController.aprovar(req, res);
});

// Rota para recusar/deletar uma solicitação de empresa
router.delete("/recusar/:idEmpresa", function (req, res) {
    solicitacaoController.recusar(req, res);
});

module.exports = router;