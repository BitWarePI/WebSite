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

    async listarQtdPorEmpresa(req, res) {
        const { idEmpresa } = req.params;

        try {
            const maquinas = await maquinaModel.listarQtdPorEmpresa(idEmpresa);
            res.status(200).json(maquinas);
        } catch (erro) {
            console.error("Erro ao listar quantidade de máquinas:", erro);
            res.status(500).json({ erro: "Erro ao listar quantidade de máquinas" });
        }
    },

    async cadastrar(req, res) {
        const { fkEmpresa, nome, enderecoMac } = req.body;

        if (!fkEmpresa || !nome || !enderecoMac) {
            return res.status(400).send("Dados incompletos.");
        }

        maquinaModel.cadastrar(fkEmpresa, nome, enderecoMac)
            .then(() => {
                res.status(200).send("Máquina cadastrada com sucesso!");
            })
            .catch(erro => {
                console.error("Erro ao cadastrar máquina:", erro);
                res.status(500).send("Erro ao cadastrar máquina.");
            });
    },


    async listarMaquinaPorEmpresa(req, res) {
        const fkEmpresa = req.params.idEmpresa;

        if (!fkEmpresa) {
            return res.status(400).send("ID da empresa é obrigatório.");
        }

        maquinaModel.listarMaquinaPorEmpresa(fkEmpresa)
            .then(resultados => res.status(200).json(resultados))
            .catch(erro => {
                console.error(erro);
                res.status(500).send("Erro ao listar máquinas.");
            });
    },

    async removerMaquina(req, res) {
        const { idMaquina } = req.params;

        if (!idMaquina) {
            return res.status(400).send("ID da máquina é obrigatório.");
        }

        maquinaModel.remover(idMaquina)
            .then(() => res.status(200).send("Máquina removida com sucesso!"))
            .catch(erro => {
                console.error(erro);
                res.status(500).send("Erro ao remover máquina.");
            });
    },

    async editarMaquina(req, res) {
        const { idMaquina } = req.params;
        const { enderecoMac, nome } = req.body;

        if (!idMaquina || !enderecoMac || !nome) {
            return res.status(400).send("Dados incompletos.");
        }

        maquinaModel.editar(idMaquina, enderecoMac, nome)
            .then(() => res.status(200).send("Máquina editada com sucesso!"))
            .catch(erro => {
                console.error(erro);
                res.status(500).send("Erro ao editar máquina.");
            });
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
        console.log(req.body)
        const { uso_cpu, uso_gpu, temp_cpu, temp_gpu } = req.body;

        try {
            await maquinaModel.definirParametrosMaquina(idMaquina, uso_cpu, uso_gpu, temp_cpu, temp_gpu);
            res.status(200).json({ mensagem: "Parâmetros individuais definidos com sucesso" });
        } catch (erro) {
            console.error("Erro ao definir parâmetros individuais:", erro);
            res.status(500).json({ erro: "Erro ao definir parâmetros individuais" });
        }
    },

    async topMaquinas(req, res) {
    const { idEmpresa } = req.params;

    try {
        const resultado = await maquinaModel.topMaquinas(idEmpresa);

        if (resultado.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(resultado);
    } catch (erro) {
        console.error("Erro ao buscar top 5 máquinas:", erro);
        res.status(500).json({ erro: "Erro ao buscar top 5 máquinas" });
    }
}

};
