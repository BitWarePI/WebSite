const AWS = require('aws-sdk');
const Papa = require('papaparse');

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

        const key = `${idEmpresa}/26-11-2025/LeiturasCLIENT.csv`;
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

module.exports = {
    pegarCsvPorMaquina,
    pegarCsvMaquinas
};
