const AWS = require('aws-sdk');
const Papa = require('papaparse');
const { getS3FileContent } = require('../utilits/getCsvBucket');

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

        const key = `${idEmpresa}/datas/${dataAtual}/LeiturasCLIENT.csv`;

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

module.exports = {
    buscarArquivoS3,
    pegarCsvPorMaquina,
    pegarCsvMaquinas
};