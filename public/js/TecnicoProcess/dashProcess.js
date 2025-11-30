async function insertInfoKpi() {
  const fkEmpresa = sessionStorage.getItem('idEmpresa');

  const response = await fetch(`/dashProcess/kpis/${fkEmpresa}`);
  if (!response.ok) throw new Error("Erro na requisição das kpis");

  const { qtdMaquinaRes, alertasUsoRes, scriptsExecutadosRes } = await response.json();
  console.log("Validando res:  ", qtdMaquinaRes)
  console.log(alertasUsoRes);


  document.getElementById("qtdMaquina").innerText = qtdMaquinaRes;
  document.getElementById("alertParametro").innerText = alertasUsoRes;
  // document.getElementById("scriptExec").innerText = scriptsExecutadosRes;

}

async function listendInfoMachine() {
  const fkEmpresa = sessionStorage.getItem('idEmpresa');

  const response = await fetch(`/dashProcess/listendProcess/${fkEmpresa}`);
  if (!response.ok) throw new Error("Erro na requisição da lista de maquinas");

  const maquina = await response.json();
  console.log("Validando res:  ", maquina)

  const listElement = document.getElementById("listendMachine");
  listElement.innerHTML = "";

  maquina.forEach((m) => {
    listElement.innerHTML += `
      <tr>
        <td>${m.addressMac}</td>
        <td>${m.setor}</td>
        <td>${m.so}</td>
        <td><span class="badge ${m.status}">${m.status}</span></td>
        <td>
          <a href="./historico&snnipts.html?mac={m.addressMac}">Open</a>
        </td>
      </tr>
    `;
  });

}

async function aplicarFiltros() {
  const fkEmpresa = sessionStorage.getItem("idEmpresa");

  const response = await fetch(`/dashProcess/listendProcess/${fkEmpresa}`);
  if (!response.ok) throw new Error("Erro na requisição da lista de maquinas");

  const maquina = await response.json();
  console.log("Validando res:  ", maquina);

  const filterMac = document.getElementById("inp_filterMac").value.toLowerCase();
  const filterSetor = document.getElementById("slt_filterOpition").value;
  const radioStatus = document.querySelector('input[name="status"]:checked');
  const filterStatus = radioStatus ? radioStatus.value : "todos";

  console.log("Filtros Aplicados:");
  console.log("MAC Address:", filterMac);
  console.log("Setor:", filterSetor);
  console.log("Status:", filterStatus);

  const maquinasFiltradas = maquina.filter(m => {

    const macPassa = !filterMac || m.addressMac.toLowerCase().includes(filterMac);

    const setorPassa = !filterSetor || m.setor.includes(filterSetor);

    const statusPassa = (filterStatus === 'todos') || (m.status === filterStatus);

    return macPassa && setorPassa && statusPassa;
  });

  const listElement = document.getElementById("listendMachine");
  listElement.innerHTML = "";
  const htmlContent = maquinasFiltradas.map(m => `
    <tr>
        <td>${m.addressMac}</td>
        <td>${m.setor}</td>
        <td>${m.so}</td>
        <td><span class="badge ${m.status}">${m.status}</span></td>
        <td>
            <a href="./historico&snnipts.html?mac=${m.addressMac}">Open</a>
        </td>
    </tr>
  `).join('');

  listElement.innerHTML = htmlContent;

}

async function listendSnippts() {
  const { fkEmpresa } = sessionStorage.getItem('idEmpresa');
  
  const response = await fetch(`/dashProcess/listendCommand/${fkEmpresa}`);
  if (!response.ok) throw new Error("Erro na requisição da lista de comandos");

  const snippts = await response.json();
  console.log("Validando res:  ", snippts)
  

  
  
  
}