const database = require("../database/config");

// Lista todas as máquinas de uma empresa com os parâmetros agregados
function listarPorEmpresa(idEmpresa) {
    const instrucao = `
    SELECT 
        t.idMaquina,
        t.enderecoMac,
        t.parametros
    FROM (
        SELECT 
            m.idMaquina,
            m.enderecoMac,
            COALESCE(JSON_OBJECT(
                'uso_cpu', MAX(CASE WHEN c.descricao = 'cpu_percent' THEN p.valor END),
                'uso_gpu', MAX(CASE WHEN c.descricao = 'gpu_percent' THEN p.valor END),
                'temp_cpu', MAX(CASE WHEN c.descricao = 'cpu_temperature' THEN p.valor END),
                'temp_gpu', MAX(CASE WHEN c.descricao = 'gpu_temperature' THEN p.valor END)
            ), NULL) AS parametros,
            MAX(CASE WHEN c.descricao = 'cpu_percent' THEN p.valor END) AS cpu,
            MAX(CASE WHEN c.descricao = 'gpu_percent' THEN p.valor END) AS gpu,
            MAX(CASE WHEN c.descricao = 'cpu_temperature' THEN p.valor END) AS tempCpu,
            MAX(CASE WHEN c.descricao = 'gpu_temperature' THEN p.valor END) AS tempGpu
        FROM Maquina m
        LEFT JOIN Parametro p ON m.idMaquina = p.fkMaquina
        LEFT JOIN Componente c ON p.fkComponente = c.idComponente
        WHERE m.fkEmpresa = ${idEmpresa}
        GROUP BY m.idMaquina
    ) AS t
    ORDER BY 
        (t.cpu IS NULL AND t.gpu IS NULL AND t.tempCpu IS NULL AND t.tempGpu IS NULL) DESC,
        t.idMaquina;
`;
    return database.executar(instrucao);
}

function listarQtdPorEmpresa(idEmpresa){
    instrucao = `
    SELECT 
        fkEmpresa,
        COUNT(idMaquina) AS qtd
    FROM Maquina
    GROUP BY fkEmpresa;
    `
    return database.executar(instrucao)
}

function cadastrar(fkEmpresa, enderecoMac){
    instrucao = `
    INSERT INTO Maquina (enderecoMac, fkEmpresa)
        VALUES 
        ('${enderecoMac}', ${fkEmpresa});
    `
    return database.executar(instrucao)
}

function listarMaquinaPorEmpresa(fkEmpresa) {
    const instrucao = `
        SELECT idMaquina, enderecoMac
        FROM maquina
        WHERE fkEmpresa = ${fkEmpresa};
    `;
    console.log("Executando SQL:\n" + instrucao);
    return database.executar(instrucao);
}

function remover(idMaquina) {
    const instrucao = `
        DELETE FROM Maquina
        WHERE idMaquina = ${idMaquina};
    `;
    console.log("Executando SQL:\n" + instrucao);
    return database.executar(instrucao);
}

function editar(idMaquina, enderecoMac) {
    const instrucao = `
        UPDATE Maquina
        SET enderecoMac = '${enderecoMac}'
        WHERE idMaquina = ${idMaquina};
    `;
    console.log("Executando SQL:\n" + instrucao);
    return database.executar(instrucao);
}

function verificarParametrosGerais(idEmpresa){
    const instrucao = `
    select * from ParametrosGeraisEmpresa where fkEmpresa = ${idEmpresa}
    `;
    return database.executar(instrucao);
}

// Cria ou atualiza os parâmetros gerais de uma empresa
function definirParametrosGerais(idEmpresa, uso_cpu, uso_gpu, temp_cpu, temp_gpu) {
    const instrucao = `
        INSERT INTO ParametrosGeraisEmpresa (fkEmpresa, cpu_percent, gpu_percent, cpu_temperature, gpu_temperature)
        VALUES (${idEmpresa}, ${uso_cpu}, ${uso_gpu}, ${temp_cpu}, ${temp_gpu})
        ON DUPLICATE KEY UPDATE
            cpu_percent = VALUES(cpu_percent),
            gpu_percent = VALUES(gpu_percent),
            cpu_temperature = VALUES(cpu_temperature),
            gpu_temperature = VALUES(gpu_temperature);
    `;
    return database.executar(instrucao);
}

// Cria ou atualiza os parâmetros individuais de uma máquina
async function definirParametrosMaquina(idMaquina, uso_cpu, uso_gpu, temp_cpu, temp_gpu) {
    const queries = [
        // CPU %
        `INSERT INTO Parametro (fkMaquina, fkComponente, valor)
         SELECT ${idMaquina}, idComponente, ${uso_cpu} FROM Componente WHERE descricao = 'cpu_percent'
         ON DUPLICATE KEY UPDATE valor = ${uso_cpu};`,

        // GPU %
        `INSERT INTO Parametro (fkMaquina, fkComponente, valor)
         SELECT ${idMaquina}, idComponente, ${uso_gpu} FROM Componente WHERE descricao = 'gpu_percent'
         ON DUPLICATE KEY UPDATE valor = ${uso_gpu};`,

        // Temp CPU
        `INSERT INTO Parametro (fkMaquina, fkComponente, valor)
         SELECT ${idMaquina}, idComponente, ${temp_cpu} FROM Componente WHERE descricao = 'cpu_temperature'
         ON DUPLICATE KEY UPDATE valor = ${temp_cpu};`,

        // Temp GPU
        `INSERT INTO Parametro (fkMaquina, fkComponente, valor)
         SELECT ${idMaquina}, idComponente, ${temp_gpu} FROM Componente WHERE descricao = 'gpu_temperature'
         ON DUPLICATE KEY UPDATE valor = ${temp_gpu};`
    ];

    for (const q of queries) {
        await database.executar(q);
    }
}

module.exports = {
    listarPorEmpresa,
    listarQtdPorEmpresa,
    cadastrar,
    listarMaquinaPorEmpresa,
    remover,
    editar,
    verificarParametrosGerais,
    definirParametrosGerais,
    definirParametrosMaquina
};
