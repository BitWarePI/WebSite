var express = require("express");
var fs = require("fs");
var csv = require("csv-parser");
var path = require("path");
var router = express.Router();

const caminhoCSV = path.join(__dirname, "../../public/assets/data/leituras_kpi.csv");

router.get("/", (req, res) => {
  const { inicio, fim } = req.query;
  let resultados = [];

  const dataInicio = inicio ? new Date(inicio) : null;
  const dataFim = fim ? new Date(fim) : null;

  fs.createReadStream(caminhoCSV)
    .pipe(csv())
    .on("data", (data) => {
      const dataRegistro = new Date(data.data);

      if (
        (!dataInicio || dataRegistro >= dataInicio) &&
        (!dataFim || dataRegistro <= dataFim)
      ) {
        resultados.push(data);
      }
    })
    .on("end", () => {
      res.json(resultados);
    })
    .on("error", (err) => {
      console.error("Erro ao ler CSV:", err);
      res.status(500).json({ error: "Erro ao ler arquivo CSV" });
    });
});

module.exports = router;
