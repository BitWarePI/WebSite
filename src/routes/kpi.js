var express = require("express");
var fs = require("fs");
var csv = require("csv-parser");
var path = require("path");
var router = express.Router();

const caminhoCSV = path.join(__dirname, "../../public/assets/data/leituras_kpi.csv");

router.get("/", (req, res) => {
  const { inicio, fim } = req.query;
  const resultados = [];

  const dataInicio = inicio ? new Date(inicio) : null;
  const dataFim = fim ? new Date(fim) : null;

  fs.createReadStream(caminhoCSV)
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => {
      console.log(data)
      const dataRegistro = new Date(data.datetime.split(" ")[0]); 

      const inicioDia = dataInicio ? new Date(dataInicio.toISOString().split("T")[0]) : null;
      const fimDia = dataFim ? new Date(dataFim.toISOString().split("T")[0]) : null;

      if (
        (!inicioDia || dataRegistro >= inicioDia) &&
        (!fimDia || dataRegistro <= fimDia)
      ) {
        resultados.push({
          data: dataRegistro.toISOString().split("T")[0],
          cpu_percent: parseFloat(data.cpu_percent),
          gpu_percent: parseFloat(data.gpu_percent),
          cpu_temperature: parseFloat(data.cpu_temperature),
          gpu_temperature: parseFloat(data.gpu_temperature),
        });
      }
    })
    .on("end", () => {
      if (resultados.length === 0) {
        return res.json([]);
      }

      const agrupado = {};
      resultados.forEach(d => {
        if (!agrupado[d.data]) agrupado[d.data] = [];
        agrupado[d.data].push(d);
      });

      const mediasPorDia = Object.keys(agrupado).map(dia => {
        const registros = agrupado[dia];
        const media = campo => registros.reduce((acc, item) => acc + item[campo], 0) / registros.length;

        return {
          data: dia,
          cpu_percent: media("cpu_percent").toFixed(1),
          gpu_percent: media("gpu_percent").toFixed(1),
          cpu_temperature: media("cpu_temperature").toFixed(1),
          gpu_temperature: media("gpu_temperature").toFixed(1),
        };
      });

      res.json(mediasPorDia);
    })
    .on("error", (err) => {
      console.error("Erro ao ler CSV:", err);
      res.status(500).json({ error: "Erro ao ler arquivo CSV" });
    });
});

module.exports = router;
