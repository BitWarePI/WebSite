DROP DATABASE IF EXISTS bitware_db;
CREATE DATABASE bitware_db;
USE bitware_db;

CREATE TABLE Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  ativo BIT(1) NOT NULL DEFAULT 0,
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
);

CREATE TABLE Maquina (
  idMaquina INT AUTO_INCREMENT,
  enderecoMac VARCHAR(50) NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idMaquina),
  CONSTRAINT fk_Empresa_Maquina FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
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
  CONSTRAINT fk_Maquina_Parametro FOREIGN KEY (fkMaquina) REFERENCES Maquina (idMaquina),
  CONSTRAINT fk_Componente_Parametro FOREIGN KEY (fkComponente) REFERENCES Componente (idComponente)
);

CREATE TABLE ParametrosGeraisEmpresa (
  fkEmpresa INT PRIMARY KEY,
  cpu_percent INT CHECK (cpu_percent BETWEEN 0 AND 100),
  gpu_percent INT CHECK (gpu_percent BETWEEN 0 AND 100),
  cpu_temperature INT CHECK (cpu_temperature BETWEEN 0 AND 120),
  gpu_temperature INT CHECK (gpu_temperature BETWEEN 0 AND 120),
  CONSTRAINT fk_Empresa_ParametrosGerais FOREIGN KEY (fkEmpresa) REFERENCES Empresa (idEmpresa)
);

CREATE TABLE Chamado (
  idChamado INT AUTO_INCREMENT PRIMARY KEY,
  fkMaquina INT NOT NULL,
  problema VARCHAR(255) NOT NULL,
  prioridade ENUM('Baixa', 'Média', 'Alta', 'Crítica') NOT NULL DEFAULT 'Média',
  status ENUM('Aberto', 'Em andamento', 'Resolvido') NOT NULL DEFAULT 'Aberto',
  idTecnico INT NULL,
  dataAbertura DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_Maquina_Chamado FOREIGN KEY (fkMaquina) REFERENCES Maquina (idMaquina),
  CONSTRAINT fk_Tecnico_Chamado FOREIGN KEY (idTecnico) REFERENCES Funcionario (idFuncionario)
);

INSERT INTO Cargo (descricao) VALUES 
('Admin'), 
('Empresa'), 
('Analista'), 
('Técnico');

INSERT INTO Empresa (cnpj, nome, email, ativo)
VALUES 
('00000000000000', 'Admin_Bitware', 'admBitware@gmail.com', 1),
('12345678000199', 'TechVision', 'contato@techvision.com', 1),
('99887766000155', 'EcoData', 'suporte@ecodata.com', 1);

INSERT INTO Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa)
VALUES 
('Admin', 'Bitware', 'admBitware@gmail.com', '87654321', 1, 1),
('Lucas', 'Silva', 'lucas.silva@techvision.com', 'senha123', 4, 2),
('Marina', 'Costa', 'marina.costa@techvision.com', 'senha123', 3, 2),
('João', 'Pereira', 'joao.pereira@ecodata.com', 'senha123', 4, 3);

INSERT INTO Maquina (enderecoMac, fkEmpresa)
VALUES 
('f4:6a:dd:7b:03:0d', 1),
('a1:b2:c3:d4:e5:f6', 2),
('ff:ee:dd:cc:bb:aa', 2),
('11:22:33:44:55:66', 3);

INSERT INTO Componente (descricao)
VALUES 
('cpu_percent'),
('gpu_percent'),
('ram_percent'),
('disk_percent'),
('cpu_temperature'),
('gpu_temperature');

INSERT INTO Parametro (fkMaquina, fkComponente, valor)
VALUES
(1, 1, 35),
(1, 2, 20),
(1, 5, 48),
(1, 6, 42),
(2, 1, 55),
(2, 2, 65),
(2, 5, 72),
(2, 6, 69),
(3, 1, 80),
(3, 2, 45),
(3, 5, 90),
(3, 6, 60),
(4, 1, 25),
(4, 2, 15),
(4, 5, 40),
(4, 6, 35);

INSERT INTO ParametrosGeraisEmpresa (fkEmpresa, cpu_percent, gpu_percent, cpu_temperature, gpu_temperature)
VALUES
(1, 35, 20, 48, 42),
(2, 60, 70, 75, 65),
(3, 40, 30, 55, 50);

INSERT INTO Chamado (fkMaquina, problema, prioridade, status, idTecnico)
VALUES
(1, 'Temperatura da CPU acima do normal', 'Alta', 'Aberto', 1),
(2, 'Uso de GPU muito alto', 'Média', 'Em andamento', 2),
(3, 'Disco cheio', 'Baixa', 'Resolvido', 3),
(2, 'Máquina reiniciando sozinha', 'Crítica', 'Aberto', 2),
(4, 'Falha na leitura de sensores', 'Alta', 'Aberto', 4);
