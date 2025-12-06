DROP DATABASE IF EXISTS bitware_db;
CREATE DATABASE bitware_db;
USE bitware_db;

CREATE TABLE Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  ativo BIT(1) NOT NULL DEFAULT 0,
  solicitouDelecao BIT(1) NOT NULL DEFAULT 0,
  dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  chave BINARY(16),
  PRIMARY KEY (idEmpresa)
);

CREATE TABLE Cargo (
  idCargo INT NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(100) NOT NULL,
  PRIMARY KEY (idCargo)
);

CREATE TABLE Funcionario (
  idFuncionario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(60) NOT NULL,
  sobrenome VARCHAR(100),
  email VARCHAR(200) NOT NULL UNIQUE,
  senha VARCHAR(200) NOT NULL,
  dataCadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  validado BIT(1) NOT NULL DEFAULT 1,
  fkCargo INT NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idFuncionario),
  CONSTRAINT fk_Funcionario_Cargo FOREIGN KEY (fkCargo) REFERENCES Cargo (idCargo),
  CONSTRAINT fk_Empresa_Funcionario FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
    ON DELETE CASCADE
);

CREATE TABLE Maquina (
  idMaquina INT AUTO_INCREMENT,
  enderecoMac VARCHAR(50) NOT NULL,
  nome VARCHAR(100),
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idMaquina),
  CONSTRAINT fk_Empresa_Maquina FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
    ON DELETE CASCADE
);

CREATE TABLE Componente (
  idComponente INT AUTO_INCREMENT,
  descricao VARCHAR(70) NOT NULL,
  PRIMARY KEY (idComponente)
);

CREATE TABLE Parametro (
  fkMaquina INT,
  fkComponente INT,
  valor INT NOT NULL,
  PRIMARY KEY (fkMaquina, fkComponente),
  CONSTRAINT fk_Maquina_Parametro FOREIGN KEY (fkMaquina) REFERENCES Maquina (idMaquina)
    ON DELETE CASCADE,
  CONSTRAINT fk_Componente_Parametro FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente)
);

CREATE TABLE ParametrosGeraisEmpresa (
  fkEmpresa INT PRIMARY KEY,
  cpu_percent INT CHECK (cpu_percent BETWEEN 0 AND 100) DEFAULT 70,
  gpu_percent INT CHECK (gpu_percent BETWEEN 0 AND 100) DEFAULT 70,
  cpu_temperature INT CHECK (cpu_temperature BETWEEN 0 AND 120) DEFAULT 70,
  gpu_temperature INT CHECK (gpu_temperature BETWEEN 0 AND 120) DEFAULT 70,
  CONSTRAINT fk_Empresa_ParametrosGerais FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
    ON DELETE CASCADE
);

CREATE TABLE Chamado (
  idChamado INT AUTO_INCREMENT PRIMARY KEY,
  fkMaquina INT NOT NULL,
  problema VARCHAR(255) NOT NULL,
  prioridade ENUM('Baixa', 'Media', 'Alta', 'Critica') NOT NULL DEFAULT 'Media',
  status ENUM('Aberto', 'Em andamento', 'Resolvido') NOT NULL DEFAULT 'Aberto',
  idTecnico INT NULL,
  dataAbertura DATETIME DEFAULT CURRENT_TIMESTAMP,
  sincronizado TINYINT(1) NOT NULL DEFAULT 0,  
  CONSTRAINT fk_Maquina_Chamado FOREIGN KEY (fkMaquina) REFERENCES Maquina (idMaquina)
    ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (idTecnico) REFERENCES Funcionario (idFuncionario)
    ON DELETE CASCADE
);

CREATE TABLE comando_personalizado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    comando TEXT NOT NULL, 
    qtdExec INT default 0,
    fk_empresa INT,                    
    FOREIGN KEY (fk_empresa) REFERENCES Empresa(idEmpresa) 
);

select * from comando_personalizado;
INSERT INTO Cargo (descricao) VALUES 
('Admin'), 
('Empresa'), 
('Analista'), 
('Tecnico');

INSERT INTO Empresa (cnpj, nome, email, ativo)
VALUES 
('00000000000000', 'Admin_Bitware', 'admBitware@gmail.com', 1),
('12345678000199', 'TechVision', 'contato@techvision.com', 1),
('99887766000155', 'EcoData', 'suporte@ecodata.com', 1);

INSERT INTO Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa)
VALUES 
('Admin', 'Bitware', 'admBitware@gmail.com', '87654321', 1, 1),
('techvision', 'Empresa', 'contato@techvision.com', '12345678', 2, 2),
('Marina', 'Costa', 'marina.costa@techvision.com', '12345678', 4, 2),
('João', 'Pereira', 'joao.pereira@ecodata.com', '12345678', 2, 3);

INSERT INTO comando_personalizado (nome, comando, fk_empresa) VALUES 
('Matar Processo (PID)', 'kill -9 {pid}', 2),
('Limpar Cache de RAM', 'sync; echo 3 > /proc/sys/vm/drop_caches', 2),
('Matar Processos (Nome)', 'pkill -f {nome_processo}', 2),
('Visualizar processos nivel adm', 'ps aux', 2),
('Reiniciar Serviço (PID)', 'systemctl restart {PID}', 2);

INSERT INTO Maquina (enderecoMac, nome, fkEmpresa)
VALUES 
('f4:6a:dd:7b:03:1d', 'Servidor Principal', 1),
('a1:b2:c3:d4:e5:f6', 'Setor A', 2),
('ff:ee:dd:cc:bb:aa', 'Setor B', 2),
('e7:5c:5f:1e:b4:1d', 'Setor C', 2),
('11:22:33:44:55:66', 'Setor Logístico', 3);

INSERT INTO Maquina (enderecoMac, nome, fkEmpresa)
VALUES
('e8:5c:5f:1e:b4:1d', 'Setor D', 1),
('12:2a:0a:85:5e:47', 'Setor A', 2), 
('f4:6a:dd:7b:03:0d', 'Setor E', 2);
('e8:5c:5f:1e:b4:1d', 'Setor D', 2),
('f4:6a:dd:7b:03:0d', 'Setor E', 2);

INSERT INTO Componente (descricao)
VALUES 
('cpu'),
('gpu'),
('cpu_temperature'),
('gpu_temperature');

INSERT INTO Parametro (fkMaquina, fkComponente, valor)
VALUES
(1, 1, 68),
(1, 2, 68),
(1, 3, 68),
(1, 4, 68),

(2, 1, 67),
(2, 2, 67),
(2, 3, 67),
(2, 4, 67),

(3, 1, 69),
(3, 2, 69),
(3, 3, 69),
(3, 4, 69),

(4, 1, 68),
(4, 2, 68),
(4, 3, 68),
(4, 4, 68),

(5, 1, 67),
(5, 2, 67),
(5, 3, 67),
(5, 4, 67);

INSERT INTO Parametro (fkMaquina, fkComponente, valor)
VALUES
(6, 1, 60), 
(6, 2, 75), 
(6, 3, 78),
(6, 4, 70), 
(7, 1, 45),  
(7, 2, 55), 
(7, 3, 65),
(7, 4, 60);

INSERT INTO ParametrosGeraisEmpresa (fkEmpresa, cpu_percent, gpu_percent, cpu_temperature, gpu_temperature)
VALUES
(1, 35, 20, 48, 42),
(2, 60, 70, 75, 65),
(3, 40, 30, 55, 50);

INSERT INTO Chamado (fkMaquina, problema, prioridade, status, idTecnico)
VALUES
-- Maquina 2
(2, 'Temperatura da GPU (C) acima do esperado', 'Alta', 'Aberto', 3),
(2, 'Uso de CPU (%) abaixo do esperado', 'Media', 'Em andamento', 3),
(2, 'Uso de GPU (%) acima do parametro - Atencao', 'Critica', 'Aberto', 3),
(2, 'Uso de CPU (%) acima do parametro - Atencao', 'Critica', 'Em andamento', 3),
(2, 'Temperatura da CPU (C) acima do esperado', 'Alta', 'Aberto', 3),
(2, 'Uso de GPU (%) abaixo do esperado', 'Baixa', 'Resolvido', 3),

-- Maquina 3
(3, 'Temperatura da CPU (C) abaixo do esperado', 'Alta', 'Aberto', 3),
(3, 'Uso de GPU (%) abaixo do esperado', 'Baixa', 'Resolvido', 3),
(3, 'Uso de CPU (%) abaixo do esperado', 'Media', 'Em andamento', 3),
(3, 'Temperatura da GPU (C) acima do esperado', 'Alta', 'Aberto', 3),
(3, 'Uso de GPU (%) acima do parametro - Atencao', 'Media', 'Aberto', 3),

-- Maquina 4
(4, 'Uso de CPU (%) acima do parametro - Atencao', 'Critica', 'Em andamento', 3),
(4, 'Temperatura da CPU (C) acima do esperado', 'Alta', 'Aberto', 3),
(4, 'Uso de GPU (%) abaixo do esperado', 'Baixa', 'Resolvido', 3),
(4, 'Temperatura da GPU (C) acima do esperado', 'Media', 'Aberto', 3),
(4, 'Uso de CPU (%) abaixo do esperado', 'Baixa', 'Aberto', 3),

-- Maquina 6
(6, 'Uso de GPU (%) acima do parametro - Atencao', 'Alta', 'Aberto', 3),
(6, 'Uso de CPU (%) abaixo do esperado', 'Media', 'Em andamento', 3),
(6, 'Temperatura da CPU (C) abaixo do esperado', 'Baixa', 'Resolvido', 3),
(6, 'Temperatura da GPU (C) acima do esperado', 'Alta', 'Aberto', 3),
(6, 'Uso de GPU (%) abaixo do esperado', 'Baixa', 'Aberto', 3),

-- Maquina 7
(7, 'Uso de CPU (%) abaixo do esperado', 'Critica', 'Aberto', 3),
(7, 'Temperatura da GPU (C) acima do esperado', 'Critica', 'Em andamento', 3),
(7, 'Temperatura da CPU (C) abaixo do esperado', 'Media', 'Aberto', 3),
(7, 'Uso de GPU (%) acima do parametro - Atencao', 'Alta', 'Aberto', 3),
(7, 'Uso de CPU (%) acima do parametro - Atencao', 'Critica', 'Em andamento', 3),
(7, 'Uso de GPU (%) abaixo do esperado', 'Baixa', 'Resolvido', 3);


# Cadastro
CREATE USER 'empresa'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT INSERT ON bitware_db.Funcionario TO 'empresa'@'%';
GRANT INSERT ON bitware_db.Empresa TO 'empresa'@'%';

# A empresa pode criar/deletar/atulizar seus usuarios (funcionarios)
CREATE USER 'funcionario.admEmpresa'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT INSERT, UPDATE, SELECT ON bitware_db.Parametro TO 'funcionario.admEmpresa'@'%';
GRANT INSERT, UPDATE, SELECT ON bitware_db.ParametrosGeraisEmpresa TO 'funcionario.admEmpresa'@'%';
GRANT INSERT, UPDATE, SELECT ON bitware_db.Chamado TO 'funcionario.admEmpresa'@'%';
GRANT INSERT, UPDATE, SELECT, DELETE ON bitware_db.Funcionario TO 'funcionario.admEmpresa'@'%';
GRANT INSERT, UPDATE, SELECT ON bitware_db.Maquina TO 'funcionario.admEmpresa'@'%';

CREATE USER 'funcionario.analista'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT SELECT ON bitware_db.Parametro TO 'funcionario.analista'@'%';
GRANT SELECT ON bitware_db.ParametrosGeraisEmpresa TO 'funcionario.analista'@'%';
GRANT SELECT, UPDATE ON bitware_db.Chamado TO 'funcionario.analista'@'%';
GRANT SELECT ON bitware_db.Maquina TO 'funcionario.analista'@'%';

CREATE USER 'funcionario.tecnico'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
GRANT SELECT ON bitware_db.Parametro TO 'funcionario.tecnico'@'%';
GRANT SELECT ON bitware_db.ParametrosGeraisEmpresa TO 'funcionario.tecnico'@'%';
GRANT SELECT ON bitware_db.Maquina TO 'funcionario.tecnico'@'%';
GRANT SELECT ON bitware_db.Chamado TO 'funcionario.tecnico'@'%';

FLUSH PRIVILEGES;