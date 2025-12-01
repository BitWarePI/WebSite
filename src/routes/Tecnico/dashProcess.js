const express = require('express');
const router = express.Router();

const dashProcess = require('../../controllers/Tecnico/processController');

router.get("/kpis/:fkEmpresa", (req, res) => {
  dashProcess.getInfoKpis(req, res);
})

router.get("/listendProcess/:fkEmpresa", (req, res) => {
  dashProcess.listendInfoMachine(req, res);
})

router.get("/listendCommand/:fkEmpresa", (req, res) => {
  dashProcess.getListCommandSnippt(req, res);
})

router.post("/listendCommand/:id", (req, res) => {
  dashProcess.posListCommandSnippt(req, res);
})

router.delete("/listendCommand/:id", (req, res) => {
  dashProcess.deleteListCommandSnippt(req, res);
})

router.put("/listendCommand/:id", (req, res) => {
  dashProcess.putListCommandSnippt(req, res);
})

module.exports = router;