DROP DATABASE IF EXISTS bitware_db;
CREATE DATABASE bitware_db;

CREATE TABLE bitware_db.Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  email varchar(200) not null,
  ativo bit(1) not null default 0,
  dtCadastro datetime  default current_timestamp,
  chave BINARY(16) , -- isso aqui tem que deixar not null depois
  PRIMARY KEY (idEmpresa)
);

CREATE TABLE bitware_db.Cargo (
  idCargo INT NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(100) NOT NULL,
  PRIMARY KEY (idCargo)
);

CREATE TABLE bitware_db.Funcionario (
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
  CONSTRAINT fk_Funcionario_Cargo
    FOREIGN KEY (fkCargo)
    REFERENCES bitware_db.Cargo (idCargo),
  CONSTRAINT fk_Empresa_Funcionario
    FOREIGN KEY (fkEmpresa)
    REFERENCES bitware_db.Empresa (idEmpresa)
);

CREATE TABLE bitware_db.Maquina (
	idMaquina INT AUTO_INCREMENT,
    enderecoMac VARCHAR(50) NOT NULL,
    fkEmpresa INT NOT NULL,
    PRIMARY KEY (idMaquina),
    CONSTRAINT fk_Empresa_Maquina
		FOREIGN KEY (fkEmpresa)
		REFERENCES bitware_db.Empresa (idEmpresa)
);

CREATE TABLE bitware_db.Componente (
	idComponente INT AUTO_INCREMENT,
    descricao VARCHAR(70) NOT NULL,
    PRIMARY KEY (idComponente)
);

CREATE TABLE bitware_db.Parametro (
	fkEmpresa INT,
    fkComponente INT,
    valor INT NOT NULL,
    unidadeMedia VARCHAR(10) NOT NULL,
    PRIMARY KEY (fkEmpresa, fkComponente),
    CONSTRAINT fk_Empresa_Parametro
		FOREIGN KEY (fkEmpresa)
		REFERENCES bitware_db.Empresa (idEmpresa),
	CONSTRAINT fk_Componente_Parametro
		FOREIGN KEY (fkComponente)
		REFERENCES bitware_db.Componente (idComponente)

);
INSERT INTO bitware_db.Cargo (descricao) VALUE ("Admin"),("Empresa"), ("Analista"), ("Técnico");
insert into bitware_db.Empresa (cnpj,nome,email, ativo) values ('00000000000000','Admin_Bitware','admBitware@gmail.com', 1);
insert into bitware_db.Funcionario (nome, sobrenome, email, senha, fkCargo, fkEmpresa) VALUES ('Admin', 'Bitware', 'admBitware@gmail.com', '87654321', 1, 1);
-- update bitware_db.empresa set ativo = 1 where idEmpresa = 2;

--  Inserir a máquina com o MAC Address
INSERT INTO bitware_db.Maquina (enderecoMac, fkEmpresa)
VALUES ('f4:6a:dd:7b:03:0d', 1);

-- Inserir os componentes/parametros monitorados
INSERT INTO bitware_db.Componente (descricao)
VALUES 
('cpu_percent'),
('gpu_percent'),
('ram_percent'),
('disk_percent'),
('cpu_temperature'),
('gpu_temperature');

-- Inserir os valores dos parâmetros da empresa (exemplo inicial)
INSERT INTO bitware_db.Parametro (fkEmpresa, fkComponente, valor, unidadeMedia)
VALUES
(1, 1, 35, '%'),   -- cpu_percent
(1, 2, 20, '%'),   -- gpu_percent
(1, 3, 70, '%'),   -- ram_percent
(1, 4, 55, '%'),   -- disk_percent
(1, 5, 48, '°C'),  -- cpu_temperature
(1, 6, 42, '°C');  -- gpu_temperature
