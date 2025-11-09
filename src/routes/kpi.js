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
          uso_cpu: parseFloat(data.uso_cpu),
          uso_gpu: parseFloat(data.uso_gpu),
          temperatura_cpu: parseFloat(data.temperatura_cpu),
          temperatura_gpu: parseFloat(data.temperatura_gpu),
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
          uso_cpu: media("uso_cpu").toFixed(1),
          uso_gpu: media("uso_gpu").toFixed(1),
          temperatura_cpu: media("temperatura_cpu").toFixed(1),
          temperatura_gpu: media("temperatura_gpu").toFixed(1),
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
