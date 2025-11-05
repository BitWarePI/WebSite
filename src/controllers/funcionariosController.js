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

function coletarDados(req, res) {
    var idFuncionario = req.params.id;

    if (idFuncionario == undefined) {
        res.status(400).send("O id do funcionario está undefined!");
    } else {
        funcionariosModel.coletarDados(idFuncionario)
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

function editar(req, res) {
    const idFuncionario = req.params.id;
    const { nome, sobrenome, email, senha, descricao } = req.body;

    if (idFuncionario == undefined) {
        res.status(400).send("O id do funcionario está undefined!");
    } else {
        funcionariosModel.editarFuncionario(idFuncionario, nome, sobrenome, email, senha, descricao)
            .then(resultado => {
                console.log(`Funcionário ${idFuncionario} atualizado com sucesso.`);
                res.status(200).json({ mensagem: "Funcionário atualizado com sucesso!" });
            })
            .catch(function (erro) {
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

function listarTecnicosPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (idEmpresa == undefined) {
        res.status(400).send("O id da empresa está undefined!");
    } else {
        funcionariosModel.listarTecnicosPorEmpresa(idEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os técnicos! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listarFuncionariosPorEmpresa,
    coletarDados,
    editar,
    cadastrarFuncionario,
    inativarFuncionario,
    ativarFuncionario,
    removerFuncionario,
    listarTecnicosPorEmpresa
}