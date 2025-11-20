var chamadosModel = require("../models/chamadosModel");

function atribuirTecnico(req, res) {
    var idChamado = req.params.idChamado;
    var idTecnico = req.body.idTecnicoServer;

    if (idChamado == undefined) {
        res.status(400).send("O id do chamado está undefined!");
    } else if (idTecnico == undefined) {
        res.status(400).send("O id do técnico está undefined!");
    } else {
        chamadosModel.atribuirTecnico(idChamado, idTecnico)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function listarChamadosPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (idEmpresa == undefined) {
        res.status(400).send("O id da empresa está undefined!");
    } else {
        chamadosModel.listarChamadosPorEmpresa(idEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os chamados! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarKPIs(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (idEmpresa == undefined) {
        res.status(400).send("O id da empresa está undefined!");
    } else {
        chamadosModel.buscarKPIs(idEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os KPIs! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarKPIsTecnico(req, res) {
    var idTecnico = req.params.idTecnico;

    if (idTecnico == undefined) {
        res.status(400).send("O id do técnico está undefined!");
    } else {
        chamadosModel.buscarKPIsTecnico(idTecnico)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os KPIs do técnico! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarChamadosCriticos(req, res){
    var fkEmpresa = req.params.idEmpresa;

    if (fkEmpresa == undefined) {
        res.status(400).send("A fkEmpresa está undefined!");
    } else {
        chamadosModel.buscarChamadosCriticos(fkEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao buscar os KPIs do técnico! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function finalizarChamado(req, res) {
    var idChamado = req.params.idChamado;
    if (idChamado == undefined) {
        res.status(400).send("O id do chamado está undefined!");
    } else {
        chamadosModel.finalizarChamado(idChamado)
            .then(function (resultado) { res.json(resultado); })
            .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
    }
}

function removerTecnico(req, res) {
    var idChamado = req.params.idChamado;
    if (idChamado == undefined) {
        res.status(400).send("O id do chamado está undefined!");
    } else {
        chamadosModel.removerTecnico(idChamado)
            .then(function (resultado) { res.json(resultado); })
            .catch(function (erro) { console.log(erro); res.status(500).json(erro.sqlMessage); });
    }
}

module.exports = {
    atribuirTecnico,
    listarChamadosPorEmpresa,
    buscarKPIs,
    buscarKPIsTecnico,
    finalizarChamado,
    removerTecnico,
    buscarChamadosCriticos
}