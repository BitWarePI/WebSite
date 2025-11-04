const express = require("express");
const router = express.Router();
const maquinaController = require("../controllers/maquinasController");

router.get("/empresa/:idEmpresa", maquinaController.listarPorEmpresa);

router.get("/empresa/parametros-gerais/:idEmpresa", maquinaController.verificarParametrosGerais);

router.post("/parametros/gerais/:idEmpresa", maquinaController.definirParametrosGerais);

router.post("/parametros/maquina/:idMaquina", maquinaController.definirParametrosMaquina);

module.exports = router;
