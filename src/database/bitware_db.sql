CREATE DATABASE bitware_db;
USE bitware_db;

CREATE TABLE bitware_db.Usuario (
	idUsuario INT AUTO_INCREMENT,
	email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(200) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    nivelAcesso INT NOT NULL DEFAULT 2,
    PRIMARY KEY (idUsuario)
);

CREATE TABLE bitware_db.Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  fkUsuario INT NOT NULL,
  chave BINARY(16), -- isso aqui tem que deixar not null depois
  PRIMARY KEY (idEmpresa),
  CONSTRAINT fk_Usuario_Empresa
    FOREIGN KEY (fkUsuario)
    REFERENCES bitware_db.Usuario (idUsuario)
);

CREATE TABLE bitware_db.Cargo (
  idCargo INT NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(100) NOT NULL,
  PRIMARY KEY (idCargo)
);

CREATE TABLE bitware_db.Funcionario (
  idFuncionario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(60) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  validado BIT(1),
  fkCargo INT NOT NULL,
  fkUsuario INT NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idFuncionario),
  CONSTRAINT fk_Funcionario_Cargo
    FOREIGN KEY (fkCargo)
    REFERENCES bitware_db.Cargo (idCargo),
  CONSTRAINT fk_Usuario_Funcionario
    FOREIGN KEY (fkUsuario)
    REFERENCES bitware_db.Usuario (idUsuario),
  CONSTRAINT fk_Empresa_Funcionario
    FOREIGN KEY (fkEmpresa)
    REFERENCES bitware_db.Empresa (idEmpresa)
);

CREATE TABLE bitware_db.Maquina (
	idMaquina INT AUTO_INCREMENT,
    hostname VARCHAR(50) NOT NULL,
    fkEmpresa INT NOT NULL,
    PRIMARY KEY (idMaquina),
    CONSTRAINT fk_Empresa_Maquina
		FOREIGN KEY (fkEmpresa)
		REFERENCES bitware_db.Empresa (idEmpresa)
);

CREATE TABLE bitware_db.Componente (
	idComponente INT AUTO_INCREMENT,
    descricao VARCHAR(70),
    PRIMARY KEY (idComponente)
);

CREATE TABLE bitware_db.Parametro (
	fkEmpresa INT,
    fkComponente INT,
    valor INT,
    unidadeMedia VARCHAR(20),
    PRIMARY KEY (fkEmpresa, fkComponente),
    CONSTRAINT fk_Empresa_Parametro
		FOREIGN KEY (fkEmpresa)
		REFERENCES bitware_db.Empresa (idEmpresa),
	CONSTRAINT fk_Componente_Parametro
		FOREIGN KEY (fkComponente)
		REFERENCES bitware_db.Componente (idComponente)

);