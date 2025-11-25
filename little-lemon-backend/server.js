// Cargar variables de entorno solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// 🔍 Verificar qué URI se está leyendo
console.log('🔍 URI que se está usando:', process.env.MONGODB_URI);

// Conexión a MongoDB Atlas usando la variable de entorno
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ==========================
// 📋 Modelo de reservación
// ==========================
const Reserva = mongoose.model('Reserva', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  guests: Number
}));

// Ruta para guardar reservaciones (POST)
app.post('/api/reservaciones', async (req, res) => {
  try {
    const nuevaReserva = new Reserva(req.body);
    await nuevaReserva.save();
    res.status(200).send({ mensaje: 'Reservación guardada' });
  } catch (err) {
    console.error('❌ Error al guardar la reservación:', err);
    res.status(500).send({ error: 'Error al guardar la reservación' });
  }
});

// Ruta para obtener todas las reservaciones (GET)
app.get('/api/reservaciones', async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (err) {
    console.error('❌ Error al obtener reservaciones:', err);
    res.status(500).send({ error: 'Error al obtener reservaciones' });
  }
});

// Ruta para eliminar una reservación por ID (DELETE)
app.delete('/api/reservaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ error: 'Reservación no encontrada' });
    }

    res.json({ mensaje: 'Reservación eliminada con éxito' });
  } catch (err) {
    console.error('❌ Error al eliminar la reservación:', err);
    res.status(500).json({ error: 'Error al eliminar la reservación' });
  }
});

// ==========================
// ✉️ Modelo de contacto
// ==========================
const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}));

// Ruta para guardar mensajes de contacto (POST)
app.post('/api/contacto', async (req, res) => {
  try {
    const nuevoMensaje = new Contact(req.body);
    await nuevoMensaje.save();
    res.status(201).send({ mensaje: 'Mensaje guardado con éxito' });
  } catch (err) {
    console.error('❌ Error al guardar el mensaje:', err);
    res.status(500).send({ error: 'Error al guardar el mensaje' });
  }
});

// Ruta para obtener todos los contactos (GET)
app.get('/api/contacto', async (req, res) => {
  try {
    const contactos = await Contact.find();
    res.json(contactos);
  } catch (err) {
    console.error('❌ Error al obtener contactos:', err);
    res.status(500).send({ error: 'Error al obtener contactos' });
  }
});

// Ruta para eliminar un contacto por ID (DELETE)
app.delete('/api/contacto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contactoEliminado = await Contact.findByIdAndDelete(id);

    if (!contactoEliminado) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    res.json({ mensaje: 'Contacto eliminado con éxito' });
  } catch (err) {
    console.error('❌ Error al eliminar el contacto:', err);
    res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
});

// ==========================
// 🚀 Iniciar servidor
// ==========================

// ==========================
// 🌐 Endpoint raíz
// ==========================
app.get('/', (req, res) => {
  res.send(`
    <h1>🍋 Bienvenido al Backend de Little Lemon 🍋</h1>
    <p>El servidor está funcionando correctamente ✅</p>
    <p>Rutas disponibles:</p>
    <ul>
      <li><a href="/api/reservaciones">/api/reservaciones</a></li>
      <li><a href="/api/contacto">/api/contacto</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
