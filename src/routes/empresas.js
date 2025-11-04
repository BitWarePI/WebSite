var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");


router.post("/cadastrarEmpresa", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
})

router.get("/listarEmpresas", function(req, res){
    empresaController.listarEmpresas(req, res);
})

router.get("/listarEmpresasAtivas", function(req, res){
    empresaController.listarEmpresasAtivas(req, res);
})

router.get("/listarEmpresasInativas", function(req, res){
    empresaController.listarEmpresasInativas(req, res);
})

router.get("/carregarKPIS", function(req, res){
    empresaController.carregarKPIS(req, res);
})


router.get("/listarEmpresasDelecao", function(req, res){
    empresaController.listarEmpresasDelecao(req, res);
})

router.post("/aprovarSolicitacao", function(req, res){
    empresaController.aprovarSolicitacao(req, res);
})

router.post("/negarSolicitacao", function(req, res){
    empresaController.negarSolicitacao(req, res);
})

router.put("/ativarEmpresa/:id", function (req, res){
    empresaController.ativarEmpresa(req, res)
})

router.put("/desativarEmpresa/:id", function (req, res){
    empresaController.desativarEmpresa(req, res)
})

module.exports = router;