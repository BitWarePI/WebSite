var express = require("express");
var router = express.Router();
var chamadosController = require("../controllers/chamadosController");

router.put("/atribuir/:idChamado", function (req, res) {
    chamadosController.atribuirTecnico(req, res);
});

router.get("/empresa/:idEmpresa", function (req, res) {
    chamadosController.listarChamadosPorEmpresa(req, res);
});

router.get("/kpi/empresa/:idEmpresa", function (req, res) {
    chamadosController.buscarKPIs(req, res);
});

module.exports = router;