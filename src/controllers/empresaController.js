
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

function listarEmpresas(req, res){
    empresaModel.listarEmpresas().then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao buscar as empresas desativadas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarEmpresasDelecao(req, res){
    empresaModel.listarEmpresasDelecao().then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao buscar as empresas desativadas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function aprovarSolicitacao(req, res){
    var idEmpresa = req.body.idEmpresa;
    empresaModel.aprovarSolicitacao(idEmpresa).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao aprovar a solicitação de exclusão da empresa", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function negarSolicitacao(req, res){
    var idEmpresa = req.body.idEmpresa;
    empresaModel.negarSolicitacao(idEmpresa).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao negar a solicitação de exclusão da empresa", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function ativarEmpresa(req, res) {
    const idEmpresa = req.params.id;

    empresaModel.ativarEmpresa(idEmpresa).then((resultado) => {
        if (resultado.affectedRows > 0) {
            res.status(200).json({ mensagem: 'Empresa ativada com sucesso.' });
        } else {
            res.status(404).json({ mensagem: 'Empresa não encontrada.' });
        }
    }).catch(function (erro) {
        console.log("Houve um erro ao ativar empresa:", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function desativarEmpresa(req, res) {
    const idEmpresa = req.params.id;

    empresaModel.desativarEmpresa(idEmpresa).then((resultado) => {
        if (resultado.affectedRows > 0) {
            res.status(200).json({ mensagem: 'Empresa desativada com sucesso.' });
        } else {
            res.status(404).json({ mensagem: 'Empresa não encontrada.' });
        }
    }).catch(function (erro) {
        console.log("Houve um erro ao ativar empresa:", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

module.exports = {
    cadastrarEmpresa,
    listarEmpresas,
    listarEmpresasDelecao,
    aprovarSolicitacao,
    negarSolicitacao,
    ativarEmpresa,
    desativarEmpresa
};
