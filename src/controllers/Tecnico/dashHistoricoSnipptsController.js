const model = require('../../models/Tecnico/processModel');
const { get } = require('../../routes/Tecnico/dashProcess');
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
         const diaT = tentativa.getDate();
         const mesT = tentativa.getMonth() + 1;
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

module.exports = {
   listendModelMachine,
};