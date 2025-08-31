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

module.exports = {
    listarFuncionariosPorEmpresa
}