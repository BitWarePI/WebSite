const model = require('../../models/Tecnico/processModel');
const { getS3FileContent } = require('../../utils/getDadosBucket');

async function listendModelMachine(req, res) {
   const { fkEmpresa } = req.params;
   const macAddress = req.query.mac;

   if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
      return res.status(400).send("Valor inválido de fkEmpresa!");
   }

   console.log(`Rota acessada: ${req.method} | ${req.path}`);

   try {
      const listaDeMaquinas = await model.listendModelMachine(fkEmpresa, macAddress);
      console.log("listaDeMaquinas: ", listaDeMaquinas);

      const pathFileKey = `${fkEmpresa}/hardware.csv`;
      const getInfoMachine = await getS3FileContent(pathFileKey);
      console.log("getInfoMachine ", getInfoMachine);

      const dataTimeNow = new Date();
      const ano = dataTimeNow.getFullYear();
      const mes = dataTimeNow.getMonth() + 1;
      const diaHoje = dataTimeNow.getDate();

      let getInfoUpdateMachine = [];
      let lastDateTime = null;

      for (let i = 0; i < 7; i++) {
         const tentativa = new Date(ano, mes - 1, diaHoje - i);
         const diaT = String(tentativa.getDate()).padStart(2, "0");
         const mesT = String(tentativa.getMonth() + 1).padStart(2, "0");
         const anoT = tentativa.getFullYear();
         const pathFileKeyHorario = `${fkEmpresa}/${diaT}-${mesT}-${anoT}/processos.csv`;

         try {
            const tentativaConteudo = await getS3FileContent(pathFileKeyHorario);
            if (Array.isArray(tentativaConteudo) && tentativaConteudo.length > 0) {
               console.log(`TentativaConteudo encontrado com ${tentativaConteudo.length} linhas`);
               console.log("Última linha (amostra):", tentativaConteudo[tentativaConteudo.length - 1]);

               getInfoUpdateMachine = tentativaConteudo;
               console.log(`Encontrado processos em: ${pathFileKeyHorario}`);
               break;
            }
         } catch (e) {
            console.warn(`Não foi possível ler ${pathFileKeyHorario}: ${e.message}`);
         }
      }

      const ultimaLinha = getInfoUpdateMachine[getInfoUpdateMachine.length - 1] || null;
      lastDateTime = ultimaLinha.datetime;


      const listaDeMaquinasProntas = listaDeMaquinas.map((maquina) => {
         const infoS3 = getInfoMachine.find(info => info.macAddress === maquina.addressMac);

         if (infoS3) {
            return {
               addressMac: maquina.addressMac,
               status: "Online",
               so: infoS3.so || 'Indisponível (Offline)',
               nome: maquina.setor || 'Indisponível (Offline)',
               ram: infoS3.qtdRam || 'Indisponível (Offline)',
               cpuCor: infoS3.cpuCor || 'Indisponível (Offline)',
               gpu: infoS3.qtdGpu || 'Indisponível (Offline)',
               disco: infoS3.qtdDisco || 'Indisponível (Offline)',
               ultimoUpdate: lastDateTime
            };
         } else {
            return {
               addressMac: maquina.addressMac,
               status: "Offline",
               so: "Indisponível (Offline)",
               nome: maquina.setor || 'Indisponível (Offline)',
               ram: 'Indisponível (Offline)',
               cpuCor: 'Indisponível (Offline)',
               gpu: 'Indisponível (Offline)',
               disco: 'Indisponível (Offline)',
               ultimoUpdate: lastDateTime
            };
         }
      });
      console.log("Resul Final:", listaDeMaquinasProntas);
      return res.json(listaDeMaquinasProntas);

   } catch (error) {
      console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
      return res.status(500).json({
         erro: error.sqlMessage || "Erro interno"
      });
   }
}

async function listendSnippts(req, res) {
   const { fkEmpresa } = req.params;

   console.log(`Rota acessada: ${req.method} | ${req.path}`);

   if (fkEmpresa === undefined || isNaN(fkEmpresa)) {
      return res.status(400).send("Valor inválido de fkEmpresa!");
   }

   try {
      const listCommand = await model.getListCommandSnippt(fkEmpresa);
      console.log("listCommand ", listCommand);
      return res.json(listCommand);

   } catch (error) {
      console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
      return res.status(500).json({
         erro: error.sqlMessage || "Erro interno"
      });
   }

}

async function listendProcessMachine(req, res) {
   const { fkEmpresa } = req.params;
   const macAddress = req.query.mac;

   if (!fkEmpresa || isNaN(fkEmpresa)) {
      return res.status(400).send("Valor inválido de fkEmpresa!");
   }

   if (!macAddress) {
      return res.status(400).send("MacAddress não informado!");
   }

   console.log(`Rota acessada: ${req.method} | ${req.path}`);

   const dataTimeNow = new Date();
   const ano = dataTimeNow.getFullYear();
   const mes = dataTimeNow.getMonth() + 1;
   const diaHoje = dataTimeNow.getDate();

   let listaProcessosFinal = [];

   for (let i = 0; i < 7; i++) {
      const dataTentativa = new Date(ano, mes - 1, diaHoje - i);

      const diaT = String(dataTentativa.getDate()).padStart(2, "0");
      const mesT = String((dataTentativa.getMonth() + 1)).padStart(2, "0");
      const anoT = dataTentativa.getFullYear();

      const pathFileKeyProcessos = `${fkEmpresa}/${diaT}-${mesT}-${anoT}/processos.csv`;
      console.log(`✝️✝️✝️✝️ Tentando acessar arquivo: ${pathFileKeyProcessos}`);

      try {
         const tentativaConteudo = await getS3FileContent(pathFileKeyProcessos);

         if (Array.isArray(tentativaConteudo) && tentativaConteudo.length > 0) {
            console.log(`Arquivo encontrado com ${tentativaConteudo.length} linhas`);

            const processosDaMaquina = tentativaConteudo.filter(proc =>
               proc.mac_address === macAddress && proc.pid > 1
            );

            const processosUnicosMap = new Map();

            processosDaMaquina.forEach(proc => {
               const dataProcessoAtual = new Date(proc.datetime);

               if (processosUnicosMap.has(proc.pid)) {
                  const procSalvo = processosUnicosMap.get(proc.pid);
                  const dataProcessoSalvo = new Date(procSalvo.datetime);

                  if (dataProcessoAtual > dataProcessoSalvo) {
                     processosUnicosMap.set(proc.pid, proc);
                  }
               } else {
                  processosUnicosMap.set(proc.pid, proc);
               }
            });

            listaProcessosFinal = Array.from(processosUnicosMap.values());

            console.log(`Processos filtrados e únicos: ${listaProcessosFinal.length}`);

            break;
         }

      } catch (error) {
         const erroMsg = error.sqlMessage || error.message || error;
         console.log(`Arquivo não encontrado ou erro na data ${diaT}/${mesT}:`, erroMsg);
      }
   }

   return res.status(200).json(listaProcessosFinal);
}

async function getUrlMachine(req, res) {
   const { fkEmpresa } = req.params;
   const macAddress = req.query.mac;

   if (!fkEmpresa || isNaN(fkEmpresa)) {
      return res.status(400).send("Valor inválido de fkEmpresa!");
   }

   console.log(`Rota acessada: ${req.method} | ${req.path}`);

   try {
      const pathFileKey = `${fkEmpresa}/hardware.csv`;
      const data = await getS3FileContent(pathFileKey);
      console.log("Olhe aqui",data);
      console.log("Olhe aqui",pathFileKey);
      
      const machineEncontrada = data.find(item => item.macAddress == macAddress);      console.log("data url machine ", machineEncontrada || 'Nenhum dado encontrado');
      
      if (!machineEncontrada) {
         return res.status(404).json({ erro: "Máquina não encontrada" });
      }

      return res.status(200).json({ ipPublico: machineEncontrada.ipPublico || null });

   } catch (error) {
      console.log("Houve um erro na captura dos dados!", error.sqlMessage || error);
      return res.status(500).json({
         erro: error.sqlMessage || "Erro interno"
      });
   }

}


module.exports = {
   listendModelMachine,
   listendSnippts,
   listendProcessMachine,
   getUrlMachine
};