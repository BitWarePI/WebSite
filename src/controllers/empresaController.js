
var empresaModel = require("../models/empresaModel");
function cadastrarEmpresa(req, res) {
    const {
        nomeEmpresaServer,
        cnpjServer,
        emailServer,
        senhaServer
    } = req.body;
    


    if (
        nomeEmpresaServer == "" ||
        cnpjServer == "" ||
        emailServer == "" ||
        senhaServer == "" 
    ) {
        res.status(400).send("Um ou mais campos está vazio ou inválido");
    } else {
        empresaModel.cadastrarEmpresa(
            nomeEmpresaServer,
            cnpjServer,
            emailServer,
            senhaServer
            
        )
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Cadastro realizado com sucesso!", resultado });
        })
        .catch(function (erro) {
            console.error("Erro ao cadastrar empresa:", erro);
            res.status(500).json({ erro: "Erro ao cadastrar empresa" });
        });
    }
}

module.exports = {
    cadastrarEmpresa
};
