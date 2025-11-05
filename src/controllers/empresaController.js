
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

function listarEmpresasAtivas(req, res){
    empresaModel.listarEmpresasAtivas().then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao buscar as empresas ativas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarEmpresasInativas(req, res){
    empresaModel.listarEmpresasInativas().then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).json([]);
        }
    }).catch(function (erro){
        console.log(erro);
        console.log("Houve um erro ao buscar as empresas inativas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function carregarKPIS(req, res){
    empresaModel.carregarKPIS().then((resultado) => {
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
    console.log("ENTROU NO ATIVAR EMPRESA")
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

function inativarEmpresa(req, res) {
    console.log("ENTROU NO INATIVAR EMPRESA")
    var idFuncionario = req.body.idFuncionario;
    var emailEmpresa = req.body.emailEmpresa;
    var senhaVar = req.body.senha;

    usuarioModel.verificarSenhaAtual(idFuncionario, senhaVar)
        .then(resultado => {
            if (resultado.length > 0) {
                // Senha atual confere, pode deletar
                empresaModel.inativarEmpresa(emailEmpresa)
                    .then(() => {
                        res.status(200).json({ mensagem: "Solicitação de deleção da empresa realizada com sucesso" });
                    })
                    .catch(erro => {
                        console.error("Erro ao solicitar deleção da Empresa:", erro);
                        res.status(500).json(erro.sqlMessage);
                    });
            } else {
                res.status(401).json({ mensagem: "Senha incorreta!" });
            }
        })
        .catch(erro => {
            console.error("Erro ao verificar senha:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrarEmpresa,
    listarEmpresas,
    listarEmpresasAtivas,
    listarEmpresasInativas,
    carregarKPIS,
    listarEmpresasDelecao,
    aprovarSolicitacao,
    negarSolicitacao,
    ativarEmpresa,
    inativarEmpresa
};
