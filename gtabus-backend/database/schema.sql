/* ============================================================
   GTABUS - Sistema de Control de Transmetro
   Script de creación de base de datos (SQL Server / T-SQL)
   ============================================================ */

CREATE DATABASE GtaBusDB;
GO
USE GtaBusDB;
GO

/* ---------------------------------------------------------
   1. MUNICIPALIDAD  (Regla 11: toda línea y estación
      pertenece a una municipalidad)
   --------------------------------------------------------- */
CREATE TABLE Municipalidad (
    id_municipalidad   INT IDENTITY(1,1) PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    direccion           VARCHAR(200) NULL,
    telefono            VARCHAR(20)  NULL
);
GO

/* ---------------------------------------------------------
   2. LINEA (Regla 13: distancia total de la línea)
   --------------------------------------------------------- */
CREATE TABLE Linea (
    id_linea            INT IDENTITY(1,1) PRIMARY KEY,
    nombre               VARCHAR(100) NOT NULL,
    codigo               VARCHAR(20)  NOT NULL UNIQUE,
    color                VARCHAR(30)  NULL,
    distancia_total_km   DECIMAL(8,2) NOT NULL DEFAULT 0,  -- Regla 13 (recalculable)
    id_municipalidad     INT NOT NULL,
    CONSTRAINT FK_Linea_Municipalidad FOREIGN KEY (id_municipalidad)
        REFERENCES Municipalidad(id_municipalidad)
);
GO

/* ---------------------------------------------------------
   3. ESTACION (Regla 11: pertenece a una municipalidad)
   --------------------------------------------------------- */
CREATE TABLE Estacion (
    id_estacion          INT IDENTITY(1,1) PRIMARY KEY,
    nombre                VARCHAR(100) NOT NULL,
    direccion             VARCHAR(200) NULL,
    latitud               DECIMAL(9,6) NULL,
    longitud              DECIMAL(9,6) NULL,
    id_municipalidad      INT NOT NULL,
    CONSTRAINT FK_Estacion_Municipalidad FOREIGN KEY (id_municipalidad)
        REFERENCES Municipalidad(id_municipalidad)
);
GO

/* ---------------------------------------------------------
   4. LINEA_ESTACION  (Regla 1 y 2: orden de estaciones en la
      ruta de cada línea; una estación puede estar en varias
      líneas y viceversa -> tabla N:M con orden)
      También resuelve la Regla 12 (distancia entre estación
      consecutiva dentro de la línea).
   --------------------------------------------------------- */
CREATE TABLE LineaEstacion (
    id_linea_estacion    INT IDENTITY(1,1) PRIMARY KEY,
    id_linea              INT NOT NULL,
    id_estacion           INT NOT NULL,
    orden                 INT NOT NULL,               -- posición dentro de la ruta
    distancia_siguiente_km DECIMAL(8,2) NULL,          -- distancia a la próxima estación de la ruta (Regla 12)
    CONSTRAINT FK_LE_Linea FOREIGN KEY (id_linea) REFERENCES Linea(id_linea),
    CONSTRAINT FK_LE_Estacion FOREIGN KEY (id_estacion) REFERENCES Estacion(id_estacion),
    CONSTRAINT UQ_Linea_Orden UNIQUE (id_linea, orden),
    CONSTRAINT UQ_Linea_Estacion UNIQUE (id_linea, id_estacion)
);
GO

/* ---------------------------------------------------------
   5. ACCESO (Regla 3: cada estación puede tener varios
      accesos, un acceso pertenece solo a una estación)
      (Regla 8: se listan todos los accesos por línea vía join
      con LineaEstacion)
   --------------------------------------------------------- */
CREATE TABLE Acceso (
    id_acceso            INT IDENTITY(1,1) PRIMARY KEY,
    nombre                VARCHAR(100) NOT NULL,   -- ej. "Acceso Norte"
    id_estacion           INT NOT NULL,
    CONSTRAINT FK_Acceso_Estacion FOREIGN KEY (id_estacion)
        REFERENCES Estacion(id_estacion)
);
GO

/* ---------------------------------------------------------
   6. GUARDIA (Regla 10: al menos un guardia por acceso)
   --------------------------------------------------------- */
CREATE TABLE Guardia (
    id_guardia           INT IDENTITY(1,1) PRIMARY KEY,
    nombre                VARCHAR(100) NOT NULL,
    dpi                   VARCHAR(20) NOT NULL UNIQUE,
    telefono               VARCHAR(20) NULL,
    id_acceso             INT NOT NULL,
    CONSTRAINT FK_Guardia_Acceso FOREIGN KEY (id_acceso)
        REFERENCES Acceso(id_acceso)
);
GO
-- Nota: la regla "al menos un guardia por acceso" se valida a nivel de
-- aplicación / procedimiento almacenado al momento de dar de alta un
-- acceso (no puede quedar sin al menos un guardia asignado).

/* ---------------------------------------------------------
   7. PARQUEO (Regla 6: algunas estaciones tienen parqueo)
   --------------------------------------------------------- */
CREATE TABLE Parqueo (
    id_parqueo            INT IDENTITY(1,1) PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    capacidad_buses        INT NOT NULL,
    id_estacion            INT NOT NULL,
    CONSTRAINT FK_Parqueo_Estacion FOREIGN KEY (id_estacion)
        REFERENCES Estacion(id_estacion)
);
GO

/* ---------------------------------------------------------
   8. BUS (Regla 4: un bus pertenece máximo a una línea;
      Regla 6/7: siempre tiene un parqueo asignado, puede
      cambiar pero nunca queda sin él;
      Regla 14/15: capacidad máxima de pasajeros)
   --------------------------------------------------------- */
CREATE TABLE Bus (
    id_bus                 INT IDENTITY(1,1) PRIMARY KEY,
    placa                   VARCHAR(15) NOT NULL UNIQUE,
    capacidad_maxima        INT NOT NULL,
    id_linea                INT NULL,          -- Regla 4: puede no estar asignado a ninguna línea
    id_parqueo_actual       INT NOT NULL,       -- Regla 7: nunca nulo
    activo                  BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Bus_Linea FOREIGN KEY (id_linea) REFERENCES Linea(id_linea),
    CONSTRAINT FK_Bus_Parqueo FOREIGN KEY (id_parqueo_actual) REFERENCES Parqueo(id_parqueo)
);
GO

/* ---------------------------------------------------------
   9. HISTORIAL_PARQUEO_BUS (Regla 7: un bus puede cambiar de
      parqueo; se guarda la bitácora de cambios)
   --------------------------------------------------------- */
CREATE TABLE HistorialParqueoBus (
    id_historial            INT IDENTITY(1,1) PRIMARY KEY,
    id_bus                   INT NOT NULL,
    id_parqueo               INT NOT NULL,
    fecha_inicio              DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_fin                 DATETIME NULL,   -- NULL = parqueo vigente
    CONSTRAINT FK_HPB_Bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus),
    CONSTRAINT FK_HPB_Parqueo FOREIGN KEY (id_parqueo) REFERENCES Parqueo(id_parqueo)
);
GO

/* ---------------------------------------------------------
   10. PILOTO (Regla 9: historial educativo, residencia y
       comunicación)
   --------------------------------------------------------- */
CREATE TABLE Piloto (
    id_piloto               INT IDENTITY(1,1) PRIMARY KEY,
    nombres                  VARCHAR(100) NOT NULL,
    apellidos                VARCHAR(100) NOT NULL,
    dpi                      VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento          DATE NULL,
    fecha_contratacion        DATE NOT NULL DEFAULT GETDATE(),
    licencia_tipo             VARCHAR(10) NOT NULL,
    activo                    BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE PilotoResidencia (
    id_residencia            INT IDENTITY(1,1) PRIMARY KEY,
    id_piloto                 INT NOT NULL UNIQUE,   -- 1:1
    direccion                  VARCHAR(200) NOT NULL,
    municipio                  VARCHAR(100) NOT NULL,
    departamento                VARCHAR(100) NOT NULL,
    CONSTRAINT FK_Residencia_Piloto FOREIGN KEY (id_piloto) REFERENCES Piloto(id_piloto)
);
GO

CREATE TABLE PilotoComunicacion (
    id_comunicacion           INT IDENTITY(1,1) PRIMARY KEY,
    id_piloto                  INT NOT NULL,          -- 1:N (teléfono, correo, contacto de emergencia)
    tipo                        VARCHAR(30) NOT NULL,  -- 'telefono', 'correo', 'emergencia'
    valor                       VARCHAR(150) NOT NULL,
    CONSTRAINT FK_Comunicacion_Piloto FOREIGN KEY (id_piloto) REFERENCES Piloto(id_piloto)
);
GO

CREATE TABLE PilotoHistorialEducativo (
    id_historial_edu           INT IDENTITY(1,1) PRIMARY KEY,
    id_piloto                   INT NOT NULL,          -- 1:N (primaria, básicos, diversificado, cursos)
    nivel                        VARCHAR(50) NOT NULL,
    institucion                  VARCHAR(150) NOT NULL,
    anio_finalizacion             INT NULL,
    titulo_obtenido                VARCHAR(150) NULL,
    CONSTRAINT FK_HistEdu_Piloto FOREIGN KEY (id_piloto) REFERENCES Piloto(id_piloto)
);
GO

/* ---------------------------------------------------------
   11. ASIGNACION PILOTO-BUS (turnos de conducción)
   --------------------------------------------------------- */
CREATE TABLE AsignacionPilotoBus (
    id_asignacion             INT IDENTITY(1,1) PRIMARY KEY,
    id_piloto                  INT NOT NULL,
    id_bus                     INT NOT NULL,
    fecha                       DATE NOT NULL,
    turno                       VARCHAR(20) NOT NULL,  -- 'mañana','tarde','noche'
    CONSTRAINT FK_APB_Piloto FOREIGN KEY (id_piloto) REFERENCES Piloto(id_piloto),
    CONSTRAINT FK_APB_Bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus)
);
GO

/* ---------------------------------------------------------
   12. OPERADOR + PC DE CONTROL POR ESTACION (Regla 16)
   --------------------------------------------------------- */
CREATE TABLE Operador (
    id_operador                INT IDENTITY(1,1) PRIMARY KEY,
    nombres                      VARCHAR(100) NOT NULL,
    apellidos                    VARCHAR(100) NOT NULL,
    usuario                       VARCHAR(50) NOT NULL UNIQUE,
    id_estacion                    INT NOT NULL,
    CONSTRAINT FK_Operador_Estacion FOREIGN KEY (id_estacion) REFERENCES Estacion(id_estacion)
);
GO

CREATE TABLE EquipoControl (      -- la PC física de cada estación (Regla 16 y 17)
    id_equipo                     INT IDENTITY(1,1) PRIMARY KEY,
    codigo_inventario               VARCHAR(50) NOT NULL UNIQUE,
    ip_asignada                     VARCHAR(15) NOT NULL,   -- red por estación (ver README - punto 17)
    id_estacion                     INT NOT NULL UNIQUE,     -- 1 PC de control por estación
    CONSTRAINT FK_Equipo_Estacion FOREIGN KEY (id_estacion) REFERENCES Estacion(id_estacion)
);
GO

/* ---------------------------------------------------------
   13. VIAJE / RECORRIDO (Regla 1: orden de visitas reales de
       cada unidad durante el recorrido, Regla 14/15: alertas
       de capacidad y espera)
   --------------------------------------------------------- */
CREATE TABLE Viaje (
    id_viaje                       INT IDENTITY(1,1) PRIMARY KEY,
    id_bus                          INT NOT NULL,
    id_linea                        INT NOT NULL,
    id_piloto                       INT NOT NULL,
    fecha_hora_inicio                DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_hora_fin                   DATETIME NULL,
    CONSTRAINT FK_Viaje_Bus FOREIGN KEY (id_bus) REFERENCES Bus(id_bus),
    CONSTRAINT FK_Viaje_Linea FOREIGN KEY (id_linea) REFERENCES Linea(id_linea),
    CONSTRAINT FK_Viaje_Piloto FOREIGN KEY (id_piloto) REFERENCES Piloto(id_piloto)
);
GO

CREATE TABLE VisitaEstacion (      -- registro real de paso de un bus por estación (Regla 1, 14, 15)
    id_visita                        INT IDENTITY(1,1) PRIMARY KEY,
    id_viaje                          INT NOT NULL,
    id_estacion                       INT NOT NULL,
    orden_visita                       INT NOT NULL,
    hora_llegada                        DATETIME NOT NULL DEFAULT GETDATE(),
    hora_salida                         DATETIME NULL,
    pasajeros_abordo                    INT NOT NULL DEFAULT 0,
    porcentaje_ocupacion                 AS (CAST(pasajeros_abordo AS DECIMAL(6,2))),  -- calculado en app contra capacidad_maxima
    genero_alerta_sobrecupo               BIT NOT NULL DEFAULT 0,   -- Regla 14: ocupación >= 150%
    espera_extendida                       BIT NOT NULL DEFAULT 0,  -- Regla 15: ocupación < 25%
    CONSTRAINT FK_Visita_Viaje FOREIGN KEY (id_viaje) REFERENCES Viaje(id_viaje),
    CONSTRAINT FK_Visita_Estacion FOREIGN KEY (id_estacion) REFERENCES Estacion(id_estacion)
);
GO

CREATE TABLE AlertaEstacion (       -- Regla 14: alerta para que llegue otro bus
    id_alerta                        INT IDENTITY(1,1) PRIMARY KEY,
    id_visita                         INT NOT NULL,
    fecha_hora                         DATETIME NOT NULL DEFAULT GETDATE(),
    mensaje                             VARCHAR(250) NOT NULL,
    atendida                            BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Alerta_Visita FOREIGN KEY (id_visita) REFERENCES VisitaEstacion(id_visita)
);
GO

/* ---------------------------------------------------------
   Índices de apoyo
   --------------------------------------------------------- */
CREATE INDEX IX_LineaEstacion_Linea ON LineaEstacion(id_linea);
CREATE INDEX IX_Bus_Linea ON Bus(id_linea);
CREATE INDEX IX_Visita_Viaje ON VisitaEstacion(id_viaje);
GO

/* ============================================================
   TRIGGER: valida Regla 5
   (buses por línea >= # estaciones de la línea y
    <= 2 * # estaciones de la línea)
   Se dispara al asignar un bus a una línea.
   ============================================================ */
CREATE TRIGGER trg_ValidarBusesPorLinea
ON Bus
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1
        FROM inserted i
        WHERE i.id_linea IS NOT NULL
        AND (
            (SELECT COUNT(*) FROM Bus b WHERE b.id_linea = i.id_linea) >
            2 * (SELECT COUNT(*) FROM LineaEstacion le WHERE le.id_linea = i.id_linea)
        )
    )
    BEGIN
        RAISERROR('La línea excede el máximo permitido de buses (2x número de estaciones).', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ============================================================
   TRIGGER: Regla 7 - un bus no puede quedar sin parqueo
   (se valida a nivel de columna NOT NULL; este trigger además
   mantiene el historial de cambios de parqueo)
   ============================================================ */
CREATE TRIGGER trg_HistorialParqueoBus
ON Bus
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(id_parqueo_actual)
    BEGIN
        UPDATE HistorialParqueoBus
        SET fecha_fin = GETDATE()
        WHERE id_bus IN (SELECT id_bus FROM inserted) AND fecha_fin IS NULL;

        INSERT INTO HistorialParqueoBus (id_bus, id_parqueo, fecha_inicio)
        SELECT id_bus, id_parqueo_actual, GETDATE() FROM inserted;
    END
END;
GO
