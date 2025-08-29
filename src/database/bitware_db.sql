CREATE DATABASE bitware_db;

CREATE TABLE bitware_db.Usuario (
	idUsuario INT AUTO_INCREMENT,
	email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(200) NOT NULL,
    nivelAcesso INT NOT NULL,
    PRIMARY KEY (idUsuario)
);

CREATE TABLE bitware_db.Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  fkUsuario INT NOT NULL,
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