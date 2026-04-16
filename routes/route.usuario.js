const usuarioController = require('../controllers/controller_usuario');

module.exports = (app) => {
    app.get('/api/usuarios', usuarioController.list);
    app.get('/api/usuarios/nombre/:nombre', usuarioController.find);
    app.get('/api/usuarios/:id', usuarioController.findById);
    app.post('/api/usuarios', usuarioController.create);
    app.put('/api/usuarios/:id', usuarioController.update);
    app.delete('/api/usuarios/:id', usuarioController.delete);
};
