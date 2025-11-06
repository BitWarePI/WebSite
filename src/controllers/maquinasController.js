const maquinaModel = require("../models/maquinaModel");

module.exports = {
    async listarPorEmpresa(req, res) {
        const { idEmpresa } = req.params;

        try {
            const maquinas = await maquinaModel.listarPorEmpresa(idEmpresa);
            res.status(200).json(maquinas);
        } catch (erro) {
            console.error("Erro ao listar máquinas:", erro);
            res.status(500).json({ erro: "Erro ao buscar máquinas" });
        }
    },


    async infoMaquinas(req, res) {
        const { idEmpresa } = req.params;

        try {
            console.log("VAI PEGAR AS INFORMAÇÕES DA MÁQUINA");

            const maquinas = await maquinaModel.infoMaquinas(idEmpresa);
            console.log("Resultado da query:", maquinas);

            res.status(200).json(maquinas); 
        } catch (erro) {
            console.error("Erro ao listar máquinas:", erro);
            res.status(500).json({ erro: "Erro ao buscar máquinas" });
        }
    },

    async verificarParametrosGerais(req, res) {
        const { idEmpresa } = req.params;

        try {
            const maquinas = await maquinaModel.verificarParametrosGerais(idEmpresa);
            res.status(200).json(maquinas);
        } catch (erro) {
            console.error("Erro ao verificar existência dos parametros gerais:", erro);
            res.status(500).json({ erro: "Erro ao verificar existência dos parametros gerais" });
        }
    },

    async definirParametrosGerais(req, res) {
        const { idEmpresa } = req.params;
        const { uso_cpu, uso_gpu, temp_cpu, temp_gpu } = req.body;

        try {
            await maquinaModel.definirParametrosGerais(idEmpresa, uso_cpu, uso_gpu, temp_cpu, temp_gpu);
            res.status(200).json({ mensagem: "Parâmetros gerais definidos com sucesso" });
        } catch (erro) {
            console.error("Erro ao definir parâmetros gerais:", erro);
            res.status(500).json({ erro: "Erro ao definir parâmetros gerais" });
        }
    },

    async definirParametrosMaquina(req, res) {
        const { idMaquina } = req.params;
        const { uso_cpu, uso_gpu, temp_cpu, temp_gpu } = req.body;

        try {
            await maquinaModel.definirParametrosMaquina(idMaquina, uso_cpu, uso_gpu, temp_cpu, temp_gpu);
            res.status(200).json({ mensagem: "Parâmetros individuais definidos com sucesso" });
        } catch (erro) {
            console.error("Erro ao definir parâmetros individuais:", erro);
            res.status(500).json({ erro: "Erro ao definir parâmetros individuais" });
        }
    }
};
