/* ============================================================
   GTABUS - Datos semilla (seed data) con lineas y estaciones
   reales del sistema Transmetro / TuBus de Guatemala.
   Fuente: informacion publica de la Municipalidad de Guatemala
   (muniguate.com) y Wikipedia. Las distancias entre estaciones
   y los accesos/guardias son ESTIMADOS/genericos para efectos
   de demostracion, ya que MuniGuate no publica esos datos
   segmento por segmento; ajustalos con datos oficiales si los
   obtienes despues.
   ============================================================ */
USE GtaBusDB2;
GO

-- 1. Municipalidades
INSERT INTO Municipalidad (nombre, direccion, telefono) VALUES
  ('Municipalidad de Guatemala', '21 Calle 6-44 Zona 1, Ciudad de Guatemala', '1551'),
  ('Municipalidad de Villa Nueva', 'Villa Nueva, Guatemala', '2000-0000');
GO

-- 2. Lineas de Transmetro / TuBus
INSERT INTO Linea (nombre, codigo, color, id_municipalidad) VALUES
  ('Linea 1 - Centro Historico', 'L1', 'Rojo', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 2 - Hipodromo', 'L2', 'Rosado', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 6 - Eje Norte', 'L6', 'Celeste', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 7', 'L7', 'Morado', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 12 - Eje Sur', 'L12', 'Azul', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 13 - Eje Central', 'L13', 'Verde', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Linea 18 - Eje Nor-oriente', 'L18', 'Naranja', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Ruta 5 (TuBus)', 'R5', 'Amarillo', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala'));
GO

-- 3. Estaciones (unicas en todo el sistema)
INSERT INTO Estacion (nombre, direccion, id_municipalidad) VALUES
  ('Gomez Carrillo', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Agustin', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Parque Centenario', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Sebastian', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Mercado Central', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Correos', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Beatas de Belen', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Paseo de las Letras', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Centro Civico', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Sur 2', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Simeon Canas', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Hipodromo del Norte', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Jose de la Montana', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Jocotenango', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('FEGUA', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Colon', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Cerro del Carmen', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Parroquia', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('IGSS Zona 6', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Centro Zona 6', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Academia', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Cipresales', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Proyectos 4-4', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Proyectos', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Quintanal', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Corpus Christi', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Jose Marti', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Santa Teresa', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Capuchinas', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('La Merced', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Cruz Roja', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Archivo General', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Santuario de Guadalupe', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Incienso', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Bethania', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('4 de Febrero', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Villa Linda', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Ciudad de Plata II', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Juan', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Roosevelt', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Jorge', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Cejusa', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Rodolfo Robles', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Granai', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('USAC Periferico', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Centra Sur', 'Villa Nueva, Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Villa Nueva')),
  ('Monte Maria', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Javier', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Las Carchas', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('El Carmen', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Reformita', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Mariscal', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Trebol', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Santa Cecilia', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Bolivar', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Don Bosco', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Plaza Municipal', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Plaza Barrios', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Plaza el Amate', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Tipografia', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('El Calvario', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('4 Grados Sur', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Exposicion', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Terminal', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Industria', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Tivoli', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Montufar', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Acueducto', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Fuerza Aerea', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Hangares', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Argentina Plaza', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Los Arcos', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Plaza Espana', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('IGSS Zona 9', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Seis 26', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Torre del Reformador', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Plaza de la Republica', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Banco de Guatemala', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Santa Clara', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Martin', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Victorias', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Portales', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Centra Atlantida', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('San Rafael', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Paraiso', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Parque Colon', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Matamoros', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Cipreses', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Jardines de la Asuncion', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Arrivillaga', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Vivibien', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Mercado La Palmita', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Palacio de los Deportes', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Penitenciaria', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('La Palmita', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala')),
  ('Parque Navidad', 'Ciudad de Guatemala', (SELECT id_municipalidad FROM Municipalidad WHERE nombre = 'Municipalidad de Guatemala'));
GO

-- 4. Ruta de cada linea (orden real de estaciones) y distancia estimada
--    entre estaciones consecutivas (placeholder de 0.8 km).
-- Linea L1
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Agustin'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Centenario'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado Central'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Correos'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Beatas de Belen'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Paseo de las Letras'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Civico'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Sur 2'), 10, NULL;
GO

-- Linea L2
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Simeon Canas'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Hipodromo del Norte'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jose de la Montana'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Jocotenango'), 5, NULL;
GO

-- Linea L6
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Colon'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cerro del Carmen'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Parroquia'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 6'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Zona 6'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Academia'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipresales'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos 4-4'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Quintanal'), 11, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Corpus Christi'), 12, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Jose Marti'), 13, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Teresa'), 14, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Capuchinas'), 15, NULL;
GO

-- Linea L7
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cruz Roja'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Archivo General'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Santuario de Guadalupe'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Incienso'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Bethania'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = '4 de Febrero'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Villa Linda'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Ciudad de Plata II'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Juan'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Roosevelt'), 11, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jorge'), 12, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cejusa'), 13, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Rodolfo Robles'), 14, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Granai'), 15, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_estacion FROM Estacion WHERE nombre = 'USAC Periferico'), 16, NULL;
GO

-- Linea L12
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Monte Maria'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Javier'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Las Carchas'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'El Carmen'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Reformita'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Mariscal'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Trebol'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Cecilia'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Bolivar'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Don Bosco'), 11, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Municipal'), 12, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Barrios'), 13, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza el Amate'), 14, NULL;
GO

-- Linea L13
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'El Calvario'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = '4 Grados Sur'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Exposicion'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Terminal'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Industria'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Tivoli'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Montufar'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Acueducto'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Fuerza Aerea'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Hangares'), 11, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Argentina Plaza'), 12, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Los Arcos'), 13, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Espana'), 14, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 9'), 15, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Seis 26'), 16, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Torre del Reformador'), 17, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza de la Republica'), 18, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Banco de Guatemala'), 19, NULL;
GO

-- Linea L18
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Clara'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Colon'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cerro del Carmen'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Martin'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Victorias'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Portales'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Atlantida'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'San Rafael'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Paraiso'), 11, NULL;
GO

-- Linea R5
INSERT INTO LineaEstacion (id_linea, id_estacion, orden, distancia_siguiente_km)
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon'), 1, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Matamoros'), 2, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipreses'), 3, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Jardines de la Asuncion'), 4, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Arrivillaga'), 5, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Vivibien'), 6, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado La Palmita'), 7, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Palacio de los Deportes'), 8, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Penitenciaria'), 9, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'La Palmita'), 10, 0.80
UNION ALL
SELECT (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Navidad'), 11, NULL;
GO

-- 5. Recalcular distancia total de cada linea (Regla 13)
UPDATE Linea
SET distancia_total_km = (
  SELECT ISNULL(SUM(distancia_siguiente_km), 0)
  FROM LineaEstacion WHERE LineaEstacion.id_linea = Linea.id_linea
);
GO

-- 6. Accesos (2 genericos por estacion: Norte y Sur)
INSERT INTO Acceso (nombre, id_estacion)
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Agustin')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Agustin')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Centenario')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Centenario')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado Central')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado Central')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Correos')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Correos')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Beatas de Belen')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Beatas de Belen')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Paseo de las Letras')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Paseo de las Letras')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Civico')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Civico')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Sur 2')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Sur 2')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Simeon Canas')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Simeon Canas')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Hipodromo del Norte')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Hipodromo del Norte')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jose de la Montana')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jose de la Montana')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jocotenango')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jocotenango')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Colon')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Colon')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cerro del Carmen')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cerro del Carmen')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parroquia')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parroquia')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 6')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 6')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Zona 6')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centro Zona 6')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Academia')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Academia')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipresales')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipresales')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos 4-4')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos 4-4')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Proyectos')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Quintanal')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Quintanal')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Corpus Christi')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Corpus Christi')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jose Marti')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jose Marti')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Teresa')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Teresa')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Capuchinas')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Capuchinas')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cruz Roja')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cruz Roja')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Archivo General')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Archivo General')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santuario de Guadalupe')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santuario de Guadalupe')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Incienso')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Incienso')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Bethania')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Bethania')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = '4 de Febrero')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = '4 de Febrero')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Villa Linda')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Villa Linda')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Ciudad de Plata II')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Ciudad de Plata II')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Juan')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Juan')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Roosevelt')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Roosevelt')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jorge')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Jorge')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cejusa')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cejusa')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Rodolfo Robles')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Rodolfo Robles')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Granai')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Granai')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'USAC Periferico')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'USAC Periferico')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Monte Maria')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Monte Maria')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Javier')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Javier')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Las Carchas')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Las Carchas')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'El Carmen')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'El Carmen')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Reformita')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Reformita')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mariscal')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mariscal')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Trebol')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Trebol')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Cecilia')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Cecilia')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Bolivar')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Bolivar')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Don Bosco')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Don Bosco')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Municipal')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Municipal')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Barrios')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Barrios')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza el Amate')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza el Amate')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'El Calvario')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'El Calvario')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = '4 Grados Sur')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = '4 Grados Sur')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Exposicion')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Exposicion')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Terminal')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Terminal')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Industria')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Industria')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tivoli')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tivoli')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Montufar')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Montufar')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Acueducto')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Acueducto')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Fuerza Aerea')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Fuerza Aerea')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Hangares')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Hangares')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Argentina Plaza')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Argentina Plaza')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Los Arcos')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Los Arcos')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Espana')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza Espana')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 9')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'IGSS Zona 9')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Seis 26')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Seis 26')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Torre del Reformador')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Torre del Reformador')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza de la Republica')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Plaza de la Republica')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Banco de Guatemala')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Banco de Guatemala')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Clara')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Santa Clara')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Martin')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Martin')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Victorias')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Victorias')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Portales')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Portales')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Atlantida')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Atlantida')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Rafael')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Rafael')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Paraiso')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Paraiso')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Matamoros')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Matamoros')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipreses')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Cipreses')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jardines de la Asuncion')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Jardines de la Asuncion')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Arrivillaga')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Arrivillaga')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Vivibien')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Vivibien')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado La Palmita')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Mercado La Palmita')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Palacio de los Deportes')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Palacio de los Deportes')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Penitenciaria')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Penitenciaria')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Palmita')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Palmita')
UNION ALL
SELECT 'Acceso Norte', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Navidad')
UNION ALL
SELECT 'Acceso Sur', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Navidad');
GO

-- 7. Guardias (1 por acceso, cumpliendo Regla 10; nombres genericos)
INSERT INTO Guardia (nombre, dpi, telefono, id_acceso)
SELECT
  'Guardia ' + CAST(a.id_acceso AS VARCHAR(10)),
  '000000' + RIGHT('00000' + CAST(a.id_acceso AS VARCHAR(10)), 5),
  '5500' + RIGHT('0000' + CAST(a.id_acceso AS VARCHAR(10)), 4),
  a.id_acceso
FROM Acceso a;
GO

-- 8. Parqueos (uno en la estacion de origen de cada linea)
INSERT INTO Parqueo (nombre, capacidad_buses, id_estacion)
SELECT 'Parqueo L1 - Gomez Carrillo', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo')
UNION ALL
SELECT 'Parqueo L2 - San Sebastian', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian')
UNION ALL
SELECT 'Parqueo L6 - FEGUA', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'Parqueo L7 - La Merced', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced')
UNION ALL
SELECT 'Parqueo L12 - Centra Sur', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur')
UNION ALL
SELECT 'Parqueo L13 - Tipografia', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia')
UNION ALL
SELECT 'Parqueo L18 - FEGUA', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'Parqueo R5 - Parque Colon', 30, (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon');
GO

-- 9. Buses (cantidad = numero de estaciones de la linea; cumple el minimo de la Regla 5)
INSERT INTO Bus (placa, capacidad_maxima, id_linea, id_parqueo_actual)
SELECT 'L1-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L1-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L1'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L1 - Gomez Carrillo')
UNION ALL
SELECT 'L2-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L2 - San Sebastian')
UNION ALL
SELECT 'L2-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L2 - San Sebastian')
UNION ALL
SELECT 'L2-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L2 - San Sebastian')
UNION ALL
SELECT 'L2-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L2 - San Sebastian')
UNION ALL
SELECT 'L2-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L2'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L2 - San Sebastian')
UNION ALL
SELECT 'L6-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-012', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-013', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-014', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L6-015', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L6'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L6 - FEGUA')
UNION ALL
SELECT 'L7-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-012', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-013', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-014', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-015', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L7-016', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L7'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L7 - La Merced')
UNION ALL
SELECT 'L12-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-012', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-013', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L12-014', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L12'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L12 - Centra Sur')
UNION ALL
SELECT 'L13-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-012', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-013', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-014', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-015', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-016', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-017', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-018', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L13-019', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L13'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L13 - Tipografia')
UNION ALL
SELECT 'L18-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'L18-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'L18'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo L18 - FEGUA')
UNION ALL
SELECT 'R5-001', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-002', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-003', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-004', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-005', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-006', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-007', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-008', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-009', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-010', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon')
UNION ALL
SELECT 'R5-011', 100, (SELECT id_linea FROM Linea WHERE codigo = 'R5'), (SELECT id_parqueo FROM Parqueo WHERE nombre = 'Parqueo R5 - Parque Colon');
GO

-- 10. Pilotos con historial educativo, residencia y comunicacion (Regla 9)
INSERT INTO Piloto (nombres, apellidos, dpi, fecha_nacimiento, licencia_tipo) VALUES
  ('Carlos', 'Ramirez Lopez', '1000100010001', '1985-04-12', 'A'),
  ('Maria', 'Gonzalez Perez', '1000200020002', '1990-08-23', 'A'),
  ('Jose', 'Hernandez Ruiz', '1000300030003', '1988-01-30', 'B'),
  ('Ana', 'Martinez Diaz', '1000400040004', '1992-11-05', 'A'),
  ('Luis', 'Chavez Morales', '1000500050005', '1983-06-18', 'B');
GO

INSERT INTO PilotoResidencia (id_piloto, direccion, municipio, departamento)
SELECT id_piloto, 'Direccion de ejemplo, Zona 1', 'Guatemala', 'Guatemala' FROM Piloto WHERE dpi = '1000100010001'
UNION ALL
SELECT id_piloto, 'Direccion de ejemplo, Zona 1', 'Guatemala', 'Guatemala' FROM Piloto WHERE dpi = '1000200020002'
UNION ALL
SELECT id_piloto, 'Direccion de ejemplo, Zona 1', 'Guatemala', 'Guatemala' FROM Piloto WHERE dpi = '1000300030003'
UNION ALL
SELECT id_piloto, 'Direccion de ejemplo, Zona 1', 'Guatemala', 'Guatemala' FROM Piloto WHERE dpi = '1000400040004'
UNION ALL
SELECT id_piloto, 'Direccion de ejemplo, Zona 1', 'Guatemala', 'Guatemala' FROM Piloto WHERE dpi = '1000500050005';
GO

INSERT INTO PilotoComunicacion (id_piloto, tipo, valor)
SELECT id_piloto, 'telefono', '55000001' FROM Piloto WHERE dpi = '1000100010001'
UNION ALL
SELECT id_piloto, 'correo', 'carlos.ramirez@gtabus.gt' FROM Piloto WHERE dpi = '1000100010001'
UNION ALL
SELECT id_piloto, 'telefono', '55000002' FROM Piloto WHERE dpi = '1000200020002'
UNION ALL
SELECT id_piloto, 'correo', 'maria.gonzalez@gtabus.gt' FROM Piloto WHERE dpi = '1000200020002'
UNION ALL
SELECT id_piloto, 'telefono', '55000003' FROM Piloto WHERE dpi = '1000300030003'
UNION ALL
SELECT id_piloto, 'correo', 'jose.hernandez@gtabus.gt' FROM Piloto WHERE dpi = '1000300030003'
UNION ALL
SELECT id_piloto, 'telefono', '55000004' FROM Piloto WHERE dpi = '1000400040004'
UNION ALL
SELECT id_piloto, 'correo', 'ana.martinez@gtabus.gt' FROM Piloto WHERE dpi = '1000400040004'
UNION ALL
SELECT id_piloto, 'telefono', '55000005' FROM Piloto WHERE dpi = '1000500050005'
UNION ALL
SELECT id_piloto, 'correo', 'luis.chavez@gtabus.gt' FROM Piloto WHERE dpi = '1000500050005';
GO

INSERT INTO PilotoHistorialEducativo (id_piloto, nivel, institucion, anio_finalizacion, titulo_obtenido)
SELECT id_piloto, 'Diversificado', 'Instituto Tecnico Vocacional', 2010, 'Perito en Mecanica Automotriz' FROM Piloto WHERE dpi = '1000100010001'
UNION ALL
SELECT id_piloto, 'Diversificado', 'Instituto Tecnico Vocacional', 2010, 'Perito en Mecanica Automotriz' FROM Piloto WHERE dpi = '1000200020002'
UNION ALL
SELECT id_piloto, 'Diversificado', 'Instituto Tecnico Vocacional', 2010, 'Perito en Mecanica Automotriz' FROM Piloto WHERE dpi = '1000300030003'
UNION ALL
SELECT id_piloto, 'Diversificado', 'Instituto Tecnico Vocacional', 2010, 'Perito en Mecanica Automotriz' FROM Piloto WHERE dpi = '1000400040004'
UNION ALL
SELECT id_piloto, 'Diversificado', 'Instituto Tecnico Vocacional', 2010, 'Perito en Mecanica Automotriz' FROM Piloto WHERE dpi = '1000500050005';
GO

-- 11. Asignacion de pilotos al primer bus de cada linea (ejemplo de turno)
INSERT INTO AsignacionPilotoBus (id_piloto, id_bus, fecha, turno)
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000100010001'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L1-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000200020002'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L2-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000300030003'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L6-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000400040004'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L7-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000500050005'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L12-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000100010001'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L13-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000200020002'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'L18-001'), CAST(GETDATE() AS DATE), 'manana'
UNION ALL
SELECT (SELECT id_piloto FROM Piloto WHERE dpi = '1000300030003'), (SELECT TOP 1 id_bus FROM Bus WHERE placa = 'R5-001'), CAST(GETDATE() AS DATE), 'manana';
GO

-- 12. Operadores + PC de control (Regla 16), muestra en las estaciones de origen de cada linea
--     (se evitan estaciones de origen repetidas entre lineas, ej. FEGUA en L6/L18)
INSERT INTO Operador (nombres, apellidos, usuario, id_estacion)
SELECT 'Operador', 'Estacion L1', 'op_l1', (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo')
UNION ALL
SELECT 'Operador', 'Estacion L2', 'op_l2', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian')
UNION ALL
SELECT 'Operador', 'Estacion L6', 'op_l6', (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'Operador', 'Estacion L7', 'op_l7', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced')
UNION ALL
SELECT 'Operador', 'Estacion L12', 'op_l12', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur')
UNION ALL
SELECT 'Operador', 'Estacion L13', 'op_l13', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia')
UNION ALL
SELECT 'Operador', 'Estacion R5', 'op_r5', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon');
GO

INSERT INTO EquipoControl (codigo_inventario, ip_asignada, id_estacion)
SELECT 'PC-L1-01', '10.10.1.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'Gomez Carrillo')
UNION ALL
SELECT 'PC-L2-01', '10.10.2.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'San Sebastian')
UNION ALL
SELECT 'PC-L6-01', '10.10.3.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'FEGUA')
UNION ALL
SELECT 'PC-L7-01', '10.10.4.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'La Merced')
UNION ALL
SELECT 'PC-L12-01', '10.10.5.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'Centra Sur')
UNION ALL
SELECT 'PC-L13-01', '10.10.6.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'Tipografia')
UNION ALL
SELECT 'PC-R5-01', '10.10.7.10', (SELECT id_estacion FROM Estacion WHERE nombre = 'Parque Colon');
GO
