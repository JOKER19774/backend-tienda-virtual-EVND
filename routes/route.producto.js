const productoController = require('../controllers/controller_producto');

module.exports = (app) => {
    app.get('/api/productos', productoController.list);
    app.get('/api/productos/:id', productoController.findById);
    app.post('/api/productos', productoController.create);
    app.put('/api/productos/:id', productoController.update);
    app.delete('/api/productos/:id', productoController.delete);
};
