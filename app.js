require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const db = require('./models');

const app = express();
const apiRoutes = [
  { method: 'GET', path: '/api' },
  { method: 'GET', path: '/api/products' },
  { method: 'GET', path: '/api/usuarios' },
  { method: 'GET', path: '/api/usuarios/:id' },
  { method: 'GET', path: '/api/usuarios/nombre/:nombre' },
  { method: 'POST', path: '/api/usuarios' },
  { method: 'POST', path: '/api/login' },
  { method: 'POST', path: '/api/usuarios/login' },
  { method: 'PUT', path: '/api/usuarios/:id' },
  { method: 'DELETE', path: '/api/usuarios/:id' },
  { method: 'GET', path: '/api/categorias' },
  { method: 'GET', path: '/api/categorias/:id' },
  { method: 'GET', path: '/api/categorias/nombre/:nombre' },
  { method: 'POST', path: '/api/categorias' },
  { method: 'PUT', path: '/api/categorias/:id' },
  { method: 'DELETE', path: '/api/categorias/:id' },
  { method: 'GET', path: '/api/productos' },
  { method: 'GET', path: '/api/productos/:id' },
  { method: 'POST', path: '/api/productos' },
  { method: 'PUT', path: '/api/productos/:id' },
  { method: 'DELETE', path: '/api/productos/:id' },
  { method: 'GET', path: '/api/carrito' },
  { method: 'GET', path: '/api/carrito/:id' },
  { method: 'POST', path: '/api/carrito' },
  { method: 'PUT', path: '/api/carrito/:id' },
  { method: 'DELETE', path: '/api/carrito/:id' },
  { method: 'GET', path: '/api/carrito-detalle' },
  { method: 'GET', path: '/api/carrito-detalle/:id' },
  { method: 'POST', path: '/api/carrito-detalle' },
  { method: 'PUT', path: '/api/carrito-detalle/:id' },
  { method: 'DELETE', path: '/api/carrito-detalle/:id' }
];

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/api', (req, res) => {
  res.json({
    message: 'API Tienda Virtual disponible',
    routes: apiRoutes
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Camiseta', price: 199, stock: 10 },
      { id: 2, name: 'Pantalon', price: 349, stock: 7 },
      { id: 3, name: 'Gorra', price: 89, stock: 15 }
    ]
  });
});

require('./routes/route.usuario')(app);
require('./routes/route.categoria')(app);
require('./routes/route.producto')(app);
require('./routes/route.carrito')(app);
require('./routes/route.carrito_detalle')(app);

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
