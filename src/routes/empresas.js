var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");


router.post("/", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
})


module.exports = router;