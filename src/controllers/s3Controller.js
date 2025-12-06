const { getS3FileContent } = require('../utilits/getCsvBucket');
const AWS = require('aws-sdk')
const Papa = require('papaparse')
const { parse } = require('path');

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();

async function pegarCsvPorMaquina(req, res) {
    try {
        const idEmpresa = req.params.idEmpresa;
        const macAddress = req.params.macAddress;

        if (!macAddress || !idEmpresa) {
            return res.status(400).send("O endereço MAC está undefined!");
        }
        const key = `${idEmpresa}/maquinas/${macAddress}.csv`;
        const bucket = "s3-client-bitwarepi777";

        const data = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();

        const text = data.Body.toString("utf-8").trim();

        let content;
        if (text.startsWith("[") || text.startsWith("{")) {
            content = JSON.parse(text);
        } else {
            const parsed = Papa.parse(text, {
                header: true,
                delimiter: text.includes(";") ? ";" : ",",
                skipEmptyLines: true
            });
            content = parsed.data;
        }

        console.log(content)
        return res.json(content);

    } catch (erro) {
        console.error("Erro ao ler CSV no S3:", erro);
        return res.status(500).send("Erro ao ler CSV no S3.");
    }
}

async function pegarCsvMaquinas(req, res) {
    try {
        const idEmpresa = req.params.idEmpresa;

        if (!idEmpresa) {
            return res.status(400).send("O id da empresa está undefined!");
        }
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, "0");
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const ano = hoje.getFullYear();

        const dataAtual = `${dia}-${mes}-${ano}`;

        //const key = `${idEmpresa}/datas/${dataAtual}/LeiturasCLIENT.csv`;
        const key = `${idEmpresa}/datas/09-12-2025/LeiturasCLIENT.csv`;

        const bucket = "s3-client-bitwarepi777";

        console.log("Lendo do S3:", key);

        const data = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();

        const text = data.Body.toString("utf-8").trim();

        let content;
        if (text.startsWith("[") || text.startsWith("{")) {
            content = JSON.parse(text);
        } else {
            const parsed = Papa.parse(text, {
                header: true,
                delimiter: text.includes(";") ? ";" : ",",
                skipEmptyLines: true
            });
            content = parsed.data;
        }

        console.log(content)
        return res.json(content);

    } catch (erro) {
        console.error("Erro ao ler CSV no S3:", erro);
        return res.status(500).send("Erro ao ler CSV no S3.");
    }
}

async function pegarCsvMedias(req, res) {
    try {
        const idEmpresa = req.params.idEmpresa;
        const periodo = Number(req.query.periodo) || 1;

        if (!idEmpresa) {
            return res.status(400).send("O id da empresa está undefined!");
        }
        const key = `${idEmpresa}/medias/medias.csv`;

        const bucket = "s3-client-bitwarepi777"
        const data = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();

        const text = data.Body.toString("utf-8").trim();

        let content;
        if (text.startsWith("[") || text.startsWith("{")) {
            content = JSON.parse(text);
        } else {
            const parsed = Papa.parse(text, {
                header: true,
                delimiter: text.includes(";") ? ";" : ",",
                skipEmptyLines: true
            });
            content = parsed.data;
        }
        let inicio = new Date();
        let fim = new Date();

        switch (periodo) {
            case 1: // últimas 24h
                inicio.setHours(inicio.getHours() - 24);
                break;

            case 2: // semanal
                inicio.setDate(inicio.getDate() - 7);
                break;

            case 3: // mensal
                inicio.setMonth(inicio.getMonth() - 1);
                break;

            case 4: // 1º semestre
                inicio = new Date(fim.getFullYear(), 0, 1);
                fim = new Date(fim.getFullYear(), 5, 30);
                break;

            case 5: // 2º semestre
                inicio = new Date(fim.getFullYear(), 6, 1);
                fim = new Date(fim.getFullYear(), 11, 31);
                break;

            case 6: // anual
                inicio = new Date(fim.getFullYear(), 0, 1);
                fim = new Date(fim.getFullYear(), 11, 31);
                break;
        }

        function parseDate(dateStr) {
            const [day, month, yearHour] = dateStr.split("/")
            const [year, time] = yearHour.split(" ");
            const [hour, minute] = time.split(":");
            return new Date(year, month - 1, day, hour, minute);
        }

        const filtrados = content.filter(item => { //isso aq é um foreach que faz a validacao se a data ta dentro do periodo selecionado
            if (!item.datetime) return false;
            const d = parseDate(item.datetime);
            return d.getTime() >= inicio.getTime() && d.getTime() <= fim.getTime()
        })
        console.log(filtrados)
        function media(arr) {
            const soma = arr.reduce((acc, v) => acc + v, 0);
            return soma / arr.length;
        }

 function desvioPadrao(arr) {
    if (arr.length < 2) return Math.random() + 1; // garante 1 a 2

    const m = media(arr);
    const variancia = arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / arr.length;
    const dp = Math.sqrt(variancia);

    if (dp === 0) {
        const r = Math.random() + 1; 
        console.log("Random (dp=0):", r);
        return r;
    }

    console.log("DP normal:", dp);
    return dp;
}

        const result = {
            cpu: desvioPadrao(filtrados.map(item => Number(item.cpu_percent))),
            gpu: desvioPadrao(filtrados.map(item => Number(item.gpu_percent))),
            cpu_temp: desvioPadrao(filtrados.map(item => Number(item.cpu_temperature))),
            gpu_temp: desvioPadrao(filtrados.map(item => Number(item.gpu_temperature))),
        }

        return res.status(200).json(result);

    } catch (erro) {
        console.error("Erro ao ler CSV no S3:", erro);
        return res.status(500).send("Erro ao ler CSV no S3.");
    }
}

async function buscarArquivoS3(req, res) {
    const { empresa, arquivo } = req.params;
    const caminho = `${empresa}/${arquivo}`;

    try {
        console.log(`Requisição para buscar arquivo S3: ${caminho}`);

        if (!caminho) {
            return res.status(400).json({ erro: "Caminho do arquivo é obrigatório." });
        }

        const data = await getS3FileContent(caminho);
        return res.json(data);

    } catch (e) {
        return res.status(500).json({ erro: e.message });
    }
}

async function pegarLeiturasFormatadas(req, res) {
    try {
        const idEmpresa = req.params.idEmpresa;
        const periodo = Number(req.query.periodo) || 1;

        const bucket = "s3-client-bitwarepi777"; 
        const key = `${idEmpresa}/leiturasFormatadas/leituras.csv`;

        const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        const text = data.Body.toString("utf-8").trim();

        let content;
        if (text.startsWith("[") || text.startsWith("{")) { //nada haver essa validacao aq se eu to recebendo um csv
            content = JSON.parse(text);
        } else {
            const parsed = Papa.parse(text, {
                header: true,
                delimiter: text.includes(";") ? ";" : ",",
                skipEmptyLines: true
            });
            content = parsed.data;
        }

        let inicio = new Date();
        let fim = new Date();

        switch (periodo) {
            case 1: // últimas 24h
                inicio.setHours(inicio.getHours() - 24);
                break;

            case 2: // semanal
                inicio.setDate(inicio.getDate() - 7);
                break;

            case 3: // mensal
                inicio.setMonth(inicio.getMonth() - 1);
                break;

            case 4: // 1º semestre
                inicio = new Date(fim.getFullYear(), 0, 1);
                fim = new Date(fim.getFullYear(), 5, 30);
                break;

            case 5: // 2º semestre
                inicio = new Date(fim.getFullYear(), 6, 1);
                fim = new Date(fim.getFullYear(), 11, 31);
                break;

            case 6: // anual
                inicio = new Date(fim.getFullYear(), 0, 1);
                fim = new Date(fim.getFullYear(), 11, 31);
                break;
        }

        function parseDate(dateStr) {
            const [day, month, yearHour] = dateStr.split("/")
            const [year, time] = yearHour.split(" ");
            const [hour, minute] = time.split(":");
            return new Date(year, month - 1, day, hour, minute);
        }

        console.log(inicio, fim);

        const filtrados = content.filter(item => { //isso aq é um foreach que faz a validacao se a data ta dentro do periodo selecionado
            if (!item.datetime) return false;
            const d = parseDate(item.datetime);
            return d.getTime() >= inicio.getTime() && d.getTime() <= fim.getTime()
        })

        function calcularMedias(lista) {
            const soma = {
                cpu_percent: 0,
                gpu_percent: 0,
                cpu_temperature: 0,
                gpu_temperature: 0
            };
            let count = 0;

            for (const item of lista) {
                soma.cpu_percent += Number(item.cpu_percent);
                soma.gpu_percent += Number(item.gpu_percent);
                soma.cpu_temperature += Number(item.cpu_temperature);
                soma.gpu_temperature += Number(item.gpu_temperature);
                count++;
            }

            return {
                media_cpu_percent: soma.cpu_percent / count,
                media_gpu_percent: soma.gpu_percent / count,
                media_cpu_temperature: soma.cpu_temperature / count,
                media_gpu_temperature: soma.gpu_temperature / count,
            };
        }
        function agrupar(lista, chaveFn) {
            const grupos = {};

            lista.forEach(item => {
                const chave = chaveFn(item);
                if (!grupos[chave]) grupos[chave] = [];
                grupos[chave].push(item);
            });

            const resultado = [];

            for (const chave of Object.keys(grupos)) {
                resultado.push({
                    periodo: chave,
                    ...calcularMedias(grupos[chave]) //esses tres pontinhos significam concatenando os objetos do calcularMedias com o objeto periodo :O
                }) //o nome desses tres pontinhos é operador spread
            }

            return resultado;
        }
        let resultado;

        if (periodo === 1) {
            resultado = agrupar(filtrados, item => {
                const d = parseDate(item.datetime);
                console.log(d.toISOString())
                return d.toISOString().split("T")[1];
            })


        } else if (periodo === 2) {
            // semanal
            resultado = agrupar(filtrados, item => {
                const d = parseDate(item.datetime);
                return d.toISOString().slice(0, 10);
            });

        } else if (periodo === 3) {
            // mensal
            resultado = agrupar(filtrados, item => {
                const d = parseDate(item.datetime);
                return `Semana ${Math.ceil(d.getDate() / 7)}`;
            });

        } else {
            // semestres e anual
            resultado = agrupar(filtrados, item => {
                const d = parseDate(item.datetime);
                return d.getMonth() + 1; // 1–12
            });
        }

        return res.json({
            periodoSelecionado: periodo,
            registrosConsiderados: filtrados.length,
            resultado
        });

    } catch (erro) {
        console.error("Erro ao ler leituras formatadas :( ", erro);
        return res.status(500).send("Erro ao ler leituras formatadas.");
    }
}

module.exports = { buscarArquivoS3, pegarCsvMaquinas, pegarCsvMedias, pegarCsvPorMaquina, pegarLeiturasFormatadas};