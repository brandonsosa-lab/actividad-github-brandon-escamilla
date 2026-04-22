const express = require('express');
const pool = require('./db'); // Asegúrate de que tu archivo db.js esté en la misma carpeta
const app = express();

// Middleware para que Express pueda recibir datos en formato JSON (Parte 2 de la actividad)
app.use(express.json());

// --- RUTA DE BIENVENIDA ---
app.get('/', (req, res) => {
  res.send('API de la UAS funcionando correctamente');
});

// ==========================================
// SECCIÓN: ALUMNOS
// ==========================================

// GET: Consultar todos los alumnos
app.get('/alumnos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM alumno');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar alumnos:', error);
    res.status(500).json({ error: 'Error al obtener los alumnos' });
  }
});

// POST: Insertar un nuevo alumno (con validación)
app.post('/alumnos', async (req, res) => {
  try {
    const { nombre, apellido, edad, correo } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !apellido || !edad || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, apellido, edad, correo)' });
    }

    const resultado = await pool.query(
      'INSERT INTO alumno (nombre, apellido, edad, correo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, edad, correo]
    );

    res.status(201).json({
      mensaje: 'Alumno insertado correctamente',
      alumno: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al insertar alumno:', error);
    res.status(500).json({ error: 'Error al insertar el alumno (el correo podría estar repetido)' });
  }
});

// ==========================================
// SECCIÓN: MATERIAS (Nueva Actividad)
// ==========================================

// GET: Consultar todas las materias (Parte 2)
app.get('/materias', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM materia');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar materias:', error);
    res.status(500).json({ error: 'Error al obtener las materias' });
  }
});

// POST: Insertar una nueva materia (Parte 3 y 4)
app.post('/materias', async (req, res) => {
  try {
    const { nombre, semestre, creditos } = req.body;

    // Validación: Comprobar que no falten datos (Parte 8)
    if (!nombre || !semestre || !creditos) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, semestre, creditos)' });
    }

    const resultado = await pool.query(
      'INSERT INTO materia (nombre, semestre, creditos) VALUES ($1, $2, $3) RETURNING *',
      [nombre, semestre, creditos]
    );

    res.status(201).json({
      mensaje: 'Materia insertada correctamente',
      materia: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al insertar materia:', error);
    res.status(500).json({ error: 'Error al insertar la materia' });
  }
});

// CONFIGURACIÓN DEL PUERTO
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});