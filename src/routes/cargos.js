var express = require("express");
var router = express.Router();

var cargoController = require("../controllers/cargoController");

router.post("/cadastrar", function (req, res) {
    cargoController.cadastrarCargo(req, res);
})

router.get("/buscar", function (req, res) {
    cargoController.buscar(req, res);
});

module.exports = router;