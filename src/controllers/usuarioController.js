var usuarioModel = require("../models/usuarioModel");


async function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        return res.status(400).send("Seu email está undefined!");
    }
    if (!senha) {
        return res.status(400).send("Sua senha está indefinida!");
    }

    try {
        const resultadoAutenticar = await usuarioModel.autenticar(email, senha);

        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

        if (resultadoAutenticar.length === 1) {
            const usuario = resultadoAutenticar[0];

            const empresaAtiva = await verificarEmpresa(usuario.fkEmpresa);
            if (!empresaAtiva) {
                return res.status(403).send("Empresa inativa ou não encontrada!");
            }

            return res.json({
                idFuncionario: usuario.idFuncionario,
                email: usuario.email,
                nome: usuario.nome,
                senha: usuario.senha,
                fkCargo: usuario.fkCargo,
                fkEmpresa: usuario.fkEmpresa,
            });
        } else if (resultadoAutenticar.length === 0) {
            return res.status(403).send("Email e/ou senha inválido(s)");
        } else {
            return res.status(403).send("Mais de um usuário com o mesmo login e senha!");
        }

    } catch (erro) {
        console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage || erro);
        return res.status(500).json(erro.sqlMessage || erro);
    }
}

async function verificarEmpresa(fkEmpresa) {
    try {
        const resultado = await usuarioModel.verificarEmpresa(fkEmpresa);

        if (resultado.length > 0) {
            if (resultado[0].ativo[0] == 1) {
                console.log("Empresa ativa.");
                return true;
            } else {
                console.log("Empresa inativa.");
                return false;
            }
        } else {
            console.log("Empresa não encontrada!");
            return false;
        }
    } catch (erro) {
        console.log("\nHouve um erro ao verificar a empresa! Erro: ", erro.sqlMessage || erro);
        return false;
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


function solicitarDelecao(req, res) {
    console.log("ENTROU NO DELETAR EMPRESA")
    var idFuncionario = req.body.idFuncionario;
    var emailEmpresa = req.body.emailEmpresa;
    var senhaVar = req.body.senha;

    usuarioModel.verificarSenhaAtual(idFuncionario, senhaVar)
        .then(resultado => {
            if (resultado.length > 0) {
                // Senha atual confere, pode deletar
                usuarioModel.solicitarDelecao(emailEmpresa)
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
    cadastrar,
    autenticar,
    atualizarSenha,
    solicitarDelecao
}
