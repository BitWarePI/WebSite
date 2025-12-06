const express = require("express");
const router = express.Router();

const dashHistoricoSnippts = require("../../controllers/Tecnico/dashHistoricoSnipptsController");

router.get("/historicoSnipptsModal/:fkEmpresa", (req, res) => {
  dashHistoricoSnippts.listendModelMachine(req, res);
});

router.get("/historicoSnipptsComandos/:fkEmpresa", (req, res) => {
  dashHistoricoSnippts.listendSnippts(req, res);
});

router.get("/historicoSnipptsProcessos/:fkEmpresa", (req, res) => {
  dashHistoricoSnippts.listendProcessMachine(req, res);
});

router.get("/getUrlMachine/:fkEmpresa", (req, res) => {
  dashHistoricoSnippts.getUrlMachine(req, res);
});



module.exports = router;