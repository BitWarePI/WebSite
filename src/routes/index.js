var express = require("express");
var fs = require("fs"); //<- isso aq le o arquivo csv
var csv = require("csv-parser"); //<- esse transforma o csv em js json
var cors = require("cors");
var router = express.Router();



router.get("/", function (req, res) {
    res.render("index");
});

module.exports = router;