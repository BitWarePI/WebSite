const express = require("express");
const router = express.Router();

const dashHistoricoSnippts = require("../../controllers/Tecnico/dashHistoricoSnipptsController");

router.get("/historicoSnipptsModal/:fkEmpresa", (req, res) => {
  dashHistoricoSnippts.listendModelMachine(req, res);
});




module.exports = router;