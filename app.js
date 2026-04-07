const express    = require('express');
const logger     = require('morgan');
const bodyParser = require('body-parser');
const http       = require('http');
const db         = require('./models');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Camiseta', price: 199, stock: 10 },
      { id: 2, name: 'Pantalón', price: 349, stock: 7 },
      { id: 3, name: 'Gorra', price: 89, stock: 15 }
    ]
  });
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await db.tbc_usuarios.findAll({ limit: 20 });
    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo obtener usuarios' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = await db.tbc_usuarios.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Datos inválidos', details: error.message });
  }
});

require('./routes/route.categoria')(app);

app.use((req, res) => {
  res.status(404).json({ error: 'No encontrado' });
});

const port = parseInt(process.env.APP_PORT, 10) || 8000;
app.set('port', port);

db.sequelize.sync().then(() => {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la DB:', err.message);
});

module.exports = app;
