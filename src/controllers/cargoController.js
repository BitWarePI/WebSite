var cargoModel = require("../models/cargoModel");

function cadastrarCargo(req, res) {
    var descricao = req.body.descricao; // o nome do cargo
    var fkEmpresa = req.body.fkEmpresa; // o id da empresa que vai cadastrar aquele cargo
    var usuarioSessao = req.body.usuarioSessao; // aqui vai ser para depois confirmar se aquele usuário pode fazer aquela ação

    if (descricao == undefined) {
        res.status(400).send("O nome do cargo está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("A empresa está undefined!");
    } else {

        cargoModel.cadastrarCargo(descricao, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro do cargo! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarCargos(req, res) {
    var fkEmpresa = req.query.fkEmpresa;
    var usuarioSessao = req.query.body;

    if (fkEmpresa == undefined) {
        res.status(400).send("A fkEmpresa está undefined!");
    } else {

        cargoModel.buscarCargos(fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar os cargos! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    cadastrarCargo
}