IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'gestion_ods_salud')
BEGIN
	CREATE DATABASE gestion_ods_salud;
END
GO

USE gestion_ods_salud;
GO

CREATE TABLE continente (
	id_continente INT IDENTITY(1,1) PRIMARY KEY,
	nombre_continente VARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE pais (
	id_pais INT IDENTITY(1,1) PRIMARY KEY,
	nombre_pais VARCHAR(100) NOT NULL,
	codigo_iso CHAR(3) NOT NULL UNIQUE,
	poblacion BIGINT NULL,
	pib DECIMAL(15,2) NULL,
	id_continente INT NOT NULL,
	FOREIGN KEY (id_continente) REFERENCES continente(id_continente)
		ON UPDATE CASCADE ON DELETE NO ACTION
);
GO

CREATE TABLE region (
	id_region INT IDENTITY(1,1) PRIMARY KEY,
	nombre_region VARCHAR(100) NOT NULL,
	id_pais INT NOT NULL,
	FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
		ON UPDATE CASCADE ON DELETE CASCADE
);
GO

CREATE TABLE objetivo_ods (
	id_objetivo INT IDENTITY(1,1) PRIMARY KEY,
	codigo_objetivo VARCHAR(10) NOT NULL UNIQUE,
	nombre_objetivo VARCHAR(200) NOT NULL,
	descripcion VARCHAR(MAX) NULL
);
GO

CREATE TABLE meta_ods (
	id_meta INT IDENTITY(1,1) PRIMARY KEY,
	id_objetivo INT NOT NULL,
	codigo_meta VARCHAR(20) NOT NULL,
	descripcion VARCHAR(MAX) NOT NULL,
	FOREIGN KEY (id_objetivo) REFERENCES objetivo_ods (id_objetivo)
		ON UPDATE CASCADE ON DELETE CASCADE
);
GO

CREATE TABLE indicador_salud (
	id_indicador INT IDENTITY(1,1) PRIMARY KEY,
	id_meta INT NOT NULL,
	codigo_indicador VARCHAR(20) NOT NULL UNIQUE,
	nombre_indicador VARCHAR(200) NOT NULL,
	unidad_medida VARCHAR(50) NOT NULL,
	descripcion VARCHAR(MAX) NULL,
	FOREIGN KEY (id_meta) REFERENCES meta_ods(id_meta)
		ON UPDATE CASCADE ON DELETE CASCADE
);
GO

CREATE TABLE fuente_datos (
	id_fuente INT IDENTITY(1,1) PRIMARY KEY,
	nombre_fuente VARCHAR(150) NOT NULL,
	tipo_fuente VARCHAR(50) NOT NULL,
	url VARCHAR(255) NULL,
	descripcion VARCHAR(MAX) NULL
);
GO

CREATE TABLE dato_indicador (
	id_dato BIGINT IDENTITY(1,1) PRIMARY KEY,
	id_indicador INT NOT NULL,
	id_pais INT NOT NULL,
	id_region INT NULL,
	id_fuente INT NOT NULL,
	anio INT NOT NULL,
	valor DECIMAL(15,4) NOT NULL,
	nivel_confianza VARCHAR(20) NULL,
	fecha_actualizacion DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (id_indicador) REFERENCES indicador_salud(id_indicador)
		ON DELETE CASCADE,
	FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
		ON DELETE NO ACTION,
	FOREIGN KEY (id_region) REFERENCES region(id_region)
		ON DELETE SET NULL,
	FOREIGN KEY (id_fuente) REFERENCES fuente_datos(id_fuente)
		ON DELETE NO ACTION,
	CONSTRAINT uc_indicador_pais_anio UNIQUE (id_indicador, id_pais, anio)
);
GO

CREATE TABLE usuario (
	id_usuario INT IDENTITY(1,1) PRIMARY KEY,
	nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
	contrasena_hash VARCHAR(255) NOT NULL,
	nombre_completo VARCHAR(100) NOT NULL,
	rol VARCHAR(20) CHECK (rol IN ('administrador''analista''consultor')) DEFAULT 'consultor',
	correo VARCHAR(150) NOT NULL UNIQUE,
	fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE reporte (
	id_reporte INT IDENTITY(1,1) PRIMARY KEY,
	id_usuario INT NOT NULL,
	titulo VARCHAR(200) NOT NULL,
	descripcion VARCHAR(MAX) NULL,
	fecha_generacion DATETIME DEFAULT GETDATE(),
	ruta_archivo VARCHAR(255) NULL,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
		ON DELETE CASCADE
);
GO

CREATE TABLE reporte_dato (
	id_reporte INT NOT NULL,
	id_dato BIGINT NOT NULL,
	PRIMARY KEY (id_reporte, id_dato),
	FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte)
		ON DELETE CASCADE,
	FOREIGN KEY (id_dato) REFERENCES dato_indicador(id_dato)
		ON DELETE CASCADE
);
GO

BACKUP DATABASE gestion_ods_salud
TO DISK = N'C:\backups\gestion_ods_salud.bak'
WITH NOFORMAT, NOINIT,
	NAME = N'gestion_ods_salud-full Database Backup',
	SKIP, NOREWIND, NOUNLOAD, COMPRESSION,
	STATS = 10;
GO