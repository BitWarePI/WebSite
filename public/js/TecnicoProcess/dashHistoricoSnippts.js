function postMacAdrressPages() {
   const params = new URLSearchParams(window.location.search);
   const macAddress = params.get('mac');

   const el = document.getElementById('Mac-Address-title');
   const el2 = document.getElementById('model-macAddress');

   if (macAddress) {
      el.textContent = macAddress;
      el2.textContent = macAddress;
   } else {
      el.textContent = 'MAC desconhecido';
   }
}

function setupSnippetSelection() {
   const container = document.querySelector('.scroll-barSnippet');
   if (!container) return;

   container.addEventListener('click', (e) => {
      const card = e.target.closest('.snippet-card');
      if (!card) return;
      const input = card.querySelector('input[name="snnipt"]');
      if (!input) return;

      if (!input.checked) input.checked = true;

      container.querySelectorAll('.snippet-card.active').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const codeBox = document.getElementById('code-box');
      const cmd = card.dataset.command || '';
      if (codeBox) codeBox.textContent = cmd;
   });
}

async function copiarComando() {
   const activeCard = document.querySelector('.snippet-card.active');

   let textoParaCopiar = activeCard.dataset.command;

   const processo = document.querySelector('.radio:checked');

   if (processo && processo.dataset.pid) {
      const pid = processo.dataset.pid;
      textoParaCopiar = textoParaCopiar.replace('{pid}', pid);
   }

   try {
      mostrarStatusPop();
      await navigator.clipboard.writeText(textoParaCopiar);
      console.log("Copiado com sucesso:", textoParaCopiar);
      document.getElementById("textoStatus").textContent = "Comando copiado!";
      setTimeout(() => esconderStatusPop(), 3000);

   } catch (err) {
      console.error("Erro ao copiar:", err);
   }
}

document.addEventListener('DOMContentLoaded', () => {
   postMacAdrressPages();
   setupSnippetSelection();
   listenProcessSelection();

   try {
      listendSnippts();
      listendModelMachine();
      listendProcess();
   } catch (e) {
      console.log('Erro ao chamar inicializadores:', e);
   }
});

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

async function listendSnippts() {
   const fkEmpresa = sessionStorage.getItem('idEmpresa');

   try {
      const response = await fetch(`/dashHistoricoSnippts/historicoSnipptsComandos/${fkEmpresa}`);

      if (!response.ok) throw new Error("Erro na requisição da lista de comandos");

      const data = await response.json();
      console.log("Validando res:  ", data);

      const listElement = document.getElementById("scroll-barSnippet");
      listElement.innerHTML = "";

      const htmlContent = data.map((s) => {
         return `
         <div class="snippet-card" data-id="${s.id}" data-command="${s.commandSnippt || ''}">
            <input type="radio" name="snnipt" value="${s.id}">
               <strong>${s.nameCommand}</strong>
         </div>
         `}).join('');

      listElement.innerHTML = htmlContent;

      const firstCard = listElement.querySelector('.snippet-card');
      if (firstCard) {
         firstCard.classList.add('active');
         const firstCmd = firstCard.dataset.command || '';
         const codeBox = document.getElementById('code-box');
         if (codeBox) codeBox.textContent = firstCmd;
      }

   } catch (error) {
      console.error("Erro ao buscar os snippets:", error);
   }

}

let processosCache = [];
async function listendProcess() {
   const fkEmpresa = sessionStorage.getItem('idEmpresa');
   const macAddress = document.getElementById('Mac-Address-title').textContent;
   const tableBody = document.getElementById('body_process');

   try {
      const response = await fetch(`/dashHistoricoSnippts/historicoSnipptsProcessos/${fkEmpresa}?mac=${encodeURIComponent(macAddress)}`);

      if (!response.ok) throw new Error("Erro na requisição da lista de processos");
      const data = await response.json();
      console.log("Validando res: ", data);

      if (data.length === 0) {
         tableBody.innerHTML = '<tr><td colspan="7">Nenhum processo encontrado para esta máquina.</td></tr>';
         setTimeout(esconderCarregando(), 10000);
         return;
      }

      data.sort((a, b) => (b.uso_de_cpu ?? 0) - (a.uso_de_cpu ?? 0));
      processosCache = data;
      renderTabela(processosCache);
      setTimeout(esconderCarregando(), 10000);

   } catch (error) {
      tableBody.innerHTML = '<tr><td colspan="7">Erro ao carregar os processos.</td></tr>';
      setTimeout(esconderCarregando(), 10000);
      console.error("Erro ao buscar os processos da máquina:", error);
   }
}

function filterProcess() {
   const filtro = document.getElementById('inp_filterProcess').value.toLowerCase();

   const processosFiltrados = processosCache.filter(proc => {
      return proc.processo.toLowerCase().includes(filtro) ||
         String(proc.pid).includes(filtro);
   });

   if (processosFiltrados.length === 0) {
      document.getElementById('body_process').innerHTML =
         '<tr><td colspan="7">Nenhum processo encontrado com o filtro aplicado.</td></tr>';
      return;
   }

   renderTabela(processosFiltrados);
}


function renderTabela(lista) {
   const tableBody = document.getElementById('body_process');

   const htmlContent = lista.map((proc) => {
      const cpu = proc.uso_de_cpu ?? 0;
      const gpu = proc.uso_de_gpu ?? 0;
      const cpuColor = getColor(cpu);
      const gpuColor = getColor(gpu);

      return `
         <tr>
            <td><input type="radio" name="processo" class="radio" data-pid="${proc.pid}"></td>

            <td style="color: #8b92a5;">${proc.pid}</td>

            <td style="color: white;">${proc.processo}</td>

            <td>
               <span class="status-badge status-${cpu > 0 ? "running" : "Idle"}">
                  ${cpu > 0 ? "Running" : "Idle"}
               </span>
            </td>

            <!-- CPU -->
            <td>
               <div class="chart-circle" style="--percent: ${cpu}; --chart-color: ${cpuColor};">
                  <span>${cpu}%</span>
               </div>
            </td>

            <!-- GPU -->
            <td>
               <div class="chart-circle" style="--percent: ${gpu}; --chart-color: ${gpuColor};">
                  <span>${gpu}%</span>
               </div>
            </td>

            <!-- Barra de memória -->
            <td class="barra-progress">
               <div class="progress-wrapper">
                  <div class="progress-bg">
                     <div class="progress-fill" 
                        style="width: ${cpu}%; background-color: ${cpuColor};">
                     </div>
                  </div>
                  <span style="font-size: 0.75rem;">${cpu}%</span>
               </div>
            </td>
         </tr>
      `;
   }).join('');

   tableBody.innerHTML = htmlContent;
}

function atualizarPreview() {
   const codeBox = document.getElementById('code-box');
   const activeCard = document.querySelector('.snippet-card.active');
   if (!codeBox || !activeCard) return;

   let comandoFinal = activeCard.dataset.command
      || activeCard.querySelector('strong')?.innerText
      || "";

   const processo = document.querySelector('.radio:checked');
   const pid = processo.dataset.pid;

   comandoFinal = comandoFinal.replace('{pid}', pid);

   codeBox.textContent = comandoFinal;
}

function listenProcessSelection() {
   const radios = document.querySelectorAll('.radio');

   radios.forEach(radio => {
      radio.addEventListener('change', atualizarPreview);
   });
}

async function executarProcesso() {
   const fkEmpresa = sessionStorage.getItem('idEmpresa');

   const activeCard = document.querySelector('.snippet-card.active');

   let textoParaCopiar = activeCard.dataset.command;

   const processo = document.querySelector('.radio:checked');

   if (processo && processo.dataset.pid) {
      const pid = processo.dataset.pid;
      textoParaCopiar = textoParaCopiar.replace('{pid}', pid);
   }

   try {
      mostrarCarregando();
      const el = document.getElementById("textoCarregamento");
      el.textContent = "Enviando comando para a máquina...";

      const getIpPublico = await fetch(`/dashHistoricoSnippts/getUrlMachine/${fkEmpresa}`);

      if (!getIpPublico.ok) throw new Error("Erro ao obter o endereço da máquina");
      
      const { ipPublico } = await getIpPublico.json();
      console.log("IpPublico: ", ipPublico);

      const url = `http://${ipPublico}:5050/run`;
      const conn = await fetch(url, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            token: "#Sprint32025#CONCLUIDA#",
            cmd: textoParaCopiar
         })
      });

      if (!conn.ok) throw new Error("Erro ao enviar comando para a máquina");
      console.log("Comando enviado com sucesso:", textoParaCopiar);

      el.textContent = "Comando executado com sucesso!";
      setTimeout(() => esconderCarregando(), 3000);

      const resultado = await conn.json();
      console.log("Resposta da máquina:", resultado);

   } catch (err) {
      console.error("Erro ao copiar:", err);
   }



}