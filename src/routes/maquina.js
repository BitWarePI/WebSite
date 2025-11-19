const express = require("express");
const router = express.Router();
const maquinaController = require("../controllers/maquinasController");

router.get("/empresa/:idEmpresa", maquinaController.listarPorEmpresa);

router.get("/top5/:idEmpresa", maquinaController.topMaquinas);

router.get("/infoMaquinas/:idEmpresa", maquinaController.infoMaquinas);

router.get("/empresa/parametros-gerais/:idEmpresa", maquinaController.verificarParametrosGerais);

router.get("/listarQtdPorEmpresa", maquinaController.listarQtdPorEmpresa);

router.post("/cadastrar", maquinaController.cadastrar);

router.get("/listarMaquinaPorEmpresa/:idEmpresa", maquinaController.listarMaquinaPorEmpresa);

router.delete("/remover/:idMaquina", maquinaController.removerMaquina);

router.put("/editar/:idMaquina", maquinaController.editarMaquina);

router.post("/parametros/gerais/:idEmpresa", maquinaController.definirParametrosGerais);

router.post("/parametros/maquina/:idMaquina", maquinaController.definirParametrosMaquina);

router.get("/qtdMaquina/:idEmpresa", maquinaController.qtdMaquinas);

router.get("/buscarOcorrencias?dataAbertura&dataFechamento", maquinaController.buscarOcorrencias)

module.exports = router;
