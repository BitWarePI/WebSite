
function postMacAdrressPages() {
   const params = new URLSearchParams(window.location.search);
   const macAddress = params.get('mac');

   const el = document.getElementById('Mac-Address-title');

   if (macAddress) {
      el.textContent = macAddress;
   } else {
      el.textContent = 'MAC desconhecido';
   }
}

document.addEventListener('DOMContentLoaded', postMacAdrressPages);

async function listendModelMachine() {
   const fkEmpresa = sessionStorage.getItem('idEmpresa');
   const params = new URLSearchParams(window.location.search);
   const macAddress = params.get('mac');

   try {
      const response = await fetch(`/dashHistoricoSnippts/historicoSnipptsModal/${fkEmpresa}?mac=${encodeURIComponent(macAddress)}`);

      if (!response.ok) throw new Error("Erro na requisição da lista de comandos");

      const data = await response.json();
      console.log("Validando res:  ", data);

      let maquina = data.find(m => m.addressMac === macAddress);
   
      if (!maquina) {
         console.warn('Nenhuma máquina encontrada na resposta');
         return;
      }

      document.getElementById('model-macAddress').textContent = maquina.addressMac || macAddress || 'Indisponível (Offline)';
      document.getElementById('model-setor').textContent = maquina.nome || 'Indisponível (Offline)';
      document.getElementById('model-so').textContent = maquina.so || 'Indisponível (Offline)';
      document.getElementById('model-ram').textContent = `${maquina.ram} GB` || 'Indisponível (Offline)';
      document.getElementById('model-cpu').textContent = `${maquina.cpuCor} Cors` || 'Indisponível (Offline)';
      document.getElementById('model-gpu').textContent = `${maquina.gpu} GB` || 'Indisponível (Offline)';
      document.getElementById('model-disco').textContent = `${maquina.disco} GB` || 'Indisponível (Offline)';
      document.getElementById('model-ultimoUpdate').textContent = maquina.ultimoUpdate || 'Indisponível (Offline)';

      const statusElement = document.getElementById('model-status');
      if (maquina.status === 'Online') {
         statusElement.innerHTML = `<span class="status-dot online"></span> Online`;
      } else {
         statusElement.innerHTML = `<span class="status-dot offline"></span> Offline`;
      }

   } catch (error) {
      console.error("Erro ao buscar os dados da máquina:", error);
   }
}