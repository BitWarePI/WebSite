var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");


router.post("/cadastrarEmpresa", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
})

router.get("/listarEmpresas", function(req, res){
    empresaController.listarEmpresas(req, res);
})

router.put("/ativarEmpresa/:id", function (req, res){
    empresaController.ativarEmpresa(req, res)
})

router.put("/desativarEmpresa/:id", function (req, res){
    empresaController.desativarEmpresa(req, res)
})

module.exports = router;