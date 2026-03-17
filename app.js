const express       = require('express');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
// This will be our application entry. We'll setup our server here.
const http = require('http');
// Set up the express app
const app = express();
// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from public folder
app.use(express.static('public'));

// API endpoint for products
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Camiseta', price: 199, stock: 10 },
      { id: 2, name: 'Pantalón', price: 349, stock: 7 },
      { id: 3, name: 'Gorra', price: 89, stock: 15 }
    ]
  });
});

// Default route for 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'No encontrado' });
});

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
module.exports = app;