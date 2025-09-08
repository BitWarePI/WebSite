drop DATABASE bitware_db;
CREATE DATABASE bitware_db;


CREATE TABLE bitware_db.Empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  cnpj VARCHAR(14) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  chave BINARY(16), -- isso aqui tem que deixar not null depois
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
  validado BIT(1) NOT NULL DEFAULT 0,
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
    hostname VARCHAR(50) NOT NULL,
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
INSERT INTO bitware_db.Cargo (descricao) VALUE ("Administrador", "Analista", "Técnico");
