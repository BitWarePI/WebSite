var express = require("express");
var router = express.Router();
var chamadosController = require("../controllers/chamadosController");
const { route } = require("./maquina");

router.put("/atribuir/:idChamado", function (req, res) {
    chamadosController.atribuirTecnico(req, res);
});

router.get("/empresa/:idEmpresa", function (req, res) {
    chamadosController.listarChamadosPorEmpresa(req, res);
});

router.get("/kpi/empresa/:idEmpresa", function (req, res) {
    chamadosController.buscarKPIs(req, res);
});

router.get("/principalProblema/:idEmpresa", function (req, res) {
    chamadosController.buscarPrincipalProblema(req, res);
});

router.get("/totalErros/:idEmpresa", function (req, res){
    chamadosController.totalErros(req, res)
});



router.get("/criticos/:idEmpresa", function (req, res){
    chamadosController.buscarChamadosCriticos(req, res)
})

router.get("/kpi/tecnico/:idTecnico", function (req, res) {
    chamadosController.buscarKPIsTecnico(req, res);
});

router.put("/finalizar/:idChamado", function (req, res) {
    chamadosController.finalizarChamado(req, res);
});

router.put("/remover-tecnico/:idChamado", function (req, res) {
    chamadosController.removerTecnico(req, res);
});

module.exports = router;