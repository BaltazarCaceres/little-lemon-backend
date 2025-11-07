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

// Modelo de reservación
const Reserva = mongoose.model('Reserva', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  guests: Number
}));

// Ruta para guardar reservaciones
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});