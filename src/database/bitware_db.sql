CREATE DATABASE bitware_db;
USE bitware_db;

CREATE TABLE bitware_db.Empresa (
  idEmpresa INT NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  PRIMARY KEY (idEmpresa)
);

CREATE TABLE bitware_db.Cargo (
  idCargo INT NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idCargo),
  CONSTRAINT fk_Cargo_Empresa
    FOREIGN KEY (fkEmpresa)
    REFERENCES bitware_db.Empresa (idEmpresa)
);

CREATE TABLE bitware_db.Funcionario (
  idUsuario INT NOT NULL,
  nome VARCHAR(60) NOT NULL,
  sobrenome VARCHAR(100) NULL,
  email VARCHAR(200) NOT NULL,
  senha VARCHAR(200) NOT NULL,
  foto VARCHAR(100),
  validado BIT(1),
  fkCargo INT NOT NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idUsuario),
  CONSTRAINT fk_Usuario_Cargo
    FOREIGN KEY (fkCargo)
    REFERENCES bitware_db.Cargo (idCargo),
  CONSTRAINT fk_Funcionario_Empresa
    FOREIGN KEY (fkEmpresa)
    REFERENCES bitware_db.Empresa (idEmpresa)
);

