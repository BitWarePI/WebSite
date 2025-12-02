// Define o ambiente: desenvolvimento ou produção
var ambiente_processo = 'desenvolvimento';
//var ambiente_processo = 'producao';

// Define o arquivo de ambiente
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
require("dotenv").config({ path: caminho_env });

// Importa pacotes
var express = require("express");
var cors = require("cors");
var path = require("path");

// Cria a aplicação Express
var app = express();

// Define host e porta a partir do .env
var PORTA_APP = process.env.APP_PORT || 3333;
var HOST_APP = process.env.APP_HOST || 'localhost';

// Importa rotas
var solicitacaoRouter = require("./src/routes/solicitacoes");
var kpiRouter = require("./src/routes/kpi");
var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var cargoRouter = require("./src/routes/cargos");
var funcionariosRouter = require("./src/routes/funcionarios");
var maquinaRouter = require("./src/routes/maquina")
//var emailRouter = require("./src/routes/emails");
var cadastrarEmpresa = require("./src/routes/empresas");
var s3Router = require("./src/routes/s3");

var chamadosRouter = require("./src/routes/chamados");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Rotas
app.use("/kpis", kpiRouter);
app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/funcionarios", funcionariosRouter);
app.use("/cargos", cargoRouter);
app.use("/empresas", cadastrarEmpresa);
app.use("/solicitacoes", solicitacaoRouter);
app.use("/maquina", maquinaRouter)
app.use("/chamados", chamadosRouter);
app.use("/s3", s3Router)
//app.use("/emails", emailRouter);

// Inicia o servidor
app.listen(PORTA_APP, HOST_APP, function () {
    console.log(`
##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
#######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  

Servidor do seu site já está rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
Você está rodando sua aplicação em ambiente de: ${process.env.AMBIENTE_PROCESSO}

\tSe desenvolvimento, você está se conectando ao banco local.
\tSe produção, você está se conectando ao banco remoto.

\t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'
`);
});
