var database = require('../database/config');

function listarFuncionariosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT f.idFuncionario, f.nome, f.sobrenome, f.email, f.validado+0 AS estado,
               DATE_FORMAT(f.dataCadastro, "%d/%m/%Y") AS data_cadastro,
               c.descricao AS cargo
        FROM Funcionario f
        LEFT JOIN Cargo c ON f.fkCargo = c.idCargo
        WHERE f.fkEmpresa = ${empresaId}
        ORDER BY f.nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql, [empresaId]);
    return database.executar(instrucaoSql, [empresaId]);
}

function coletarDados(idFuncionario) {
    var instrucaoSql = `
        SELECT nome, sobrenome, email, senha, Cargo.descricao FROM Funcionario 
        f INNER JOIN Cargo ON f.fkCargo = Cargo.idCargo WHERE idFuncionario = ${idFuncionario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql, [idFuncionario]);
    return database.executar(instrucaoSql, [idFuncionario]);
}

function editarFuncionario(idFuncionario, nome, sobrenome, email, senha, cargo) {
    console.log("Entrando em editarFuncionario...");
    var sql = '';

    if(senha == null){
        sql = `
            UPDATE Funcionario
            SET 
            nome = '${nome}',
            sobrenome = '${sobrenome}',
            email = '${email}',
            fkCargo = (
                SELECT idCargo 
                FROM Cargo 
                WHERE LOWER(descricao) = LOWER('${cargo}') 
                LIMIT 1
            )
            WHERE idFuncionario = ${idFuncionario};
        `;
    }else{
        sql = `
            UPDATE Funcionario
            SET 
            nome = '${nome}',
            senha = '${senha}',
            sobrenome = '${sobrenome}',
            email = '${email}',
            fkCargo = (
                SELECT idCargo 
                FROM Cargo 
                WHERE LOWER(descricao) = LOWER('${cargo}') 
                LIMIT 1
            )
            WHERE idFuncionario = ${idFuncionario};
        `;
    }
    

    console.log("Query:", sql);
    console.log("Valores:", [nome, sobrenome, email, cargo, idFuncionario]);

    return database.executar(sql, [nome, sobrenome, email, cargo, idFuncionario]);
}



function cadastrarFuncionario(nome, sobrenome, email, senha, cargo, empresaId) {
    var instrucaoFuncionario = `
        INSERT INTO Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa, validado)
        VALUES ('${nome}', '${sobrenome}', '${email}', '${senha}', 
        (SELECT idCargo FROM Cargo WHERE descricao = '${cargo}'), ${empresaId}, 1);
    `;
    console.log("Executando a instrução SQL (funcionario): \n" + instrucaoFuncionario);
    return database.executar(instrucaoFuncionario);
}

function inativarFuncionario(funcionarioId) {
    var instrucaoSql = `
        UPDATE Funcionario 
        SET validado = 0
        WHERE idFuncionario = ${funcionarioId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ativarFuncionario(funcionarioId) {
    var instrucaoSql = `
        UPDATE Funcionario
        SET validado = 1
        WHERE idFuncionario = ${funcionarioId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function removerFuncionario(funcionarioId) {
    var instrucaoSql = `
        DELETE FROM Funcionario WHERE idFuncionario = ${funcionarioId};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTecnicosPorEmpresa(empresaId) {
    var instrucaoSql = `
        SELECT 
            f.idFuncionario, 
            f.nome, 
            f.sobrenome, 
            f.email,
            c.descricao AS cargo,
            e.nome AS nomeEmpresa,
            (SELECT COUNT(idChamado) 
             FROM Chamado 
             WHERE idTecnico = f.idFuncionario AND status = 'Em andamento') AS qtdChamados
        FROM Funcionario f
            JOIN Empresa e ON f.fkEmpresa = e.idEmpresa
            JOIN Cargo c ON f.fkCargo = c.idCargo
        WHERE f.fkEmpresa = ${empresaId} AND c.descricao = 'Técnico' AND f.validado = 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarFuncionariosPorEmpresa,
    coletarDados,
    editarFuncionario,
    cadastrarFuncionario,
    inativarFuncionario,
    ativarFuncionario,
    removerFuncionario,
    listarTecnicosPorEmpresa
};