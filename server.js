const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/reservaciones', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modelo de reservación
const Reserva = mongoose.model('Reserva', new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  guests: Number
}));

app.use(cors());
app.use(bodyParser.json());

// Ruta para guardar reservaciones
app.post('/api/reservaciones', async (req, res) => {
  try {
    const nuevaReserva = new Reserva(req.body);
    await nuevaReserva.save();
    res.status(200).send({ mensaje: 'Reservación guardada' });
  } catch (err) {
    res.status(500).send({ error: 'Error al guardar la reservación' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});