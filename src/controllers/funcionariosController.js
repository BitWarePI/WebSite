var funcionariosModel = require("../models/funcionariosModel");

function listarFuncionariosPorEmpresa(req, res) {
    var empresaId = req.params.id;

    if (empresaId == undefined) {
        res.status(400).send("O id da empresa está undefined!");
    } else {
        funcionariosModel.listarFuncionariosPorEmpresa(empresaId)
            .then(function (resultado) {
                console.log(`\nResultados encontrados: ${resultado.length}`);
                console.log(`Resultados: ${JSON.stringify(resultado)}`);
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os funcionários! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrarFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var sobrenome = req.body.sobrenomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;
    var empresaId = req.body.empresaIdServer;
    console.log(nome, sobrenome, email, senha, cargo, empresaId);

    if (nome == undefined) {
        res.status(400).send("O nome do funcionário está undefined!");
    } else {
        // Adicione aqui a lógica para cadastrar o funcionário usando funcionariosModel
        funcionariosModel.cadastrarFuncionario(nome, sobrenome, email, senha, cargo, empresaId)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao cadastrar o funcionário! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function inativarFuncionario(req, res) {
    var funcionarioId = req.params.id;
    if (funcionarioId == undefined) {
        res.status(400).send("O id do funcionário está undefined!");
    } else {
        funcionariosModel.inativarFuncionario(funcionarioId)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }   
}

function ativarFuncionario(req, res) {
    var funcionarioId = req.params.id;
    if (funcionarioId == undefined) {
        res.status(400).send("O id do funcionário está undefined!");
    } else {
        funcionariosModel.ativarFuncionario(funcionarioId)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function removerFuncionario(req, res) {
    var funcionarioId = req.params.id;
    if (funcionarioId == undefined) {
        res.status(400).send("O id do funcionário está undefined!");
    } else {
        funcionariosModel.removerFuncionario(funcionarioId)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }   
}

module.exports = {
    listarFuncionariosPorEmpresa,
    cadastrarFuncionario,
    inativarFuncionario,
    ativarFuncionario,
    removerFuncionario
}