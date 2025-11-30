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

router.post("/listendCommand:1", (req, res) => {
  dashProcess.posListCommandSnippt(req, res);
})

router.delete("/listendCommand:2", (req, res) => {
  dashProcess.getListCommandSnippt(req, res);
})

router.put("/listendCommand:3", (req, res) => {
  dashProcess.putListCommandSnippt(req, res);
})

module.exports = router;