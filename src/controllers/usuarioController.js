var usuarioModel = require("../models/usuarioModel");


function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            idFuncionario: resultadoAutenticar[0].idFuncionario,
                            email: resultadoAutenticar[0].email,
                            senha: resultadoAutenticar[0].senha,
                            fkCargo: resultadoAutenticar[0].fkCargo
                        });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var sobrenome = req.body.sobrenomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var fkCargo = req.body.fkCargoServer;
    var fkEmpresa = req.body.fkEmpresaServer;
    // var usuarioSessao = req.body.usuarioSessao; // aqui vai ser para depois confirmar se aquele usuário pode fazer aquela ação
    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (sobrenome == undefined) {
        res.status(400).send("Seu sobrenome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else if (fkCargo === undefined) {
        res.status(400).send("Seu cargo está undefined");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, sobrenome, email, senha, fkCargo, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function atualizarSenha(req, res) {
    var idFuncionario = req.body.idFuncionario;
    var senhaAtual = req.body.senhaAtual;
    var novaSenha = req.body.senha;

    usuarioModel.verificarSenhaAtual(idFuncionario, senhaAtual)
        .then(resultado => {
            if (resultado.length > 0) {
                // Senha atual confere, pode atualizar
                usuarioModel.atualizarSenha(idFuncionario, novaSenha)
                    .then(() => {
                        res.status(200).json({ mensagem: "Senha atualizada com sucesso!" });
                    })
                    .catch(erro => {
                        console.error("Erro ao atualizar senha:", erro);
                        res.status(500).json(erro.sqlMessage);
                    });
            } else {
                res.status(401).json({ mensagem: "Senha atual incorreta!" });
            }
        })
        .catch(erro => {
            console.error("Erro ao verificar senha:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    cadastrar,
    autenticar,
    atualizarSenha
}
