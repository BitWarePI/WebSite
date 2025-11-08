var solicitacaoModel = require("../models/solicitacaoModel");

function listarPendentes(req, res) {
    solicitacaoModel.listarPendentes()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as solicitações pendentes: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function aprovar(req, res) {
    var idEmpresa = req.params.idEmpresa;

    solicitacaoModel.aprovar(idEmpresa)
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Empresa aprovada com sucesso!" });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function recusar(req, res) {
    var idEmpresa = req.params.idEmpresa;

    solicitacaoModel.recusar(idEmpresa)
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Solicitação recusada com sucesso." });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarPendentes,
    aprovar,
    recusar
};