const express = require('express');
const pool = require('./db'); // Esto conecta con tu archivo db.js
const app = express();

app.use(express.json());

// Ruta principal para saber que el servidor vive
app.get('/', (req, res) => {
  res.send('Servidor de la UAS funcionando correctamente');
});

// ESTA ES LA PARTE QUE PIDE TU TAREA: Consultar los alumnos
app.get('/alumnos', async (req, res) => {
  try {
    // Hace la consulta a la tabla que vimos en pgAdmin
    const resultado = await pool.query('SELECT * FROM alumno');
    
    // Envía los datos al navegador en formato JSON
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'No se pudieron cargar los alumnos' });
  }
});

// El servidor escuchará en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});