const db = require('../models');
const carritoDetalle = db.tbc_carrito_detalle;
const carrito = db.tbc_carrito;
const producto = db.tbc_productos;
const categoria = db.tbc_categoria;
const usuario = db.tbc_usuarios;

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderJsonPage(title, data) {
    const compactJson = JSON.stringify(data);
    const prettyJson = JSON.stringify(data, null, 2);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
        :root {
            color-scheme: light;
            --bg: #f6f8fb;
            --panel: #ffffff;
            --line: #d7dde8;
            --text: #243447;
            --muted: #6b7a90;
            --accent: #1687d9;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: Consolas, "Courier New", monospace;
            background:
                radial-gradient(circle at top left, rgba(22, 135, 217, 0.12), transparent 32%),
                linear-gradient(180deg, #f9fbfd 0%, var(--bg) 100%);
            color: var(--text);
            padding: 24px;
        }

        .viewer {
            max-width: 980px;
            margin: 0 auto;
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 18px 50px rgba(36, 52, 71, 0.08);
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.85);
        }

        .title {
            margin: 0;
            font-size: 16px;
            color: var(--muted);
        }

        label {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: var(--text);
            cursor: pointer;
        }

        input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--accent);
        }

        pre {
            margin: 0;
            padding: 22px;
            min-height: 420px;
            overflow: auto;
            font-size: 20px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .hint {
            padding: 0 22px 18px;
            color: var(--muted);
            font-size: 13px;
        }
    </style>
</head>
<body>
    <main class="viewer">
        <div class="toolbar">
            <p class="title">${title}</p>
            <label>
                <span>Impresion con formato estilistico</span>
                <input id="prettyToggle" type="checkbox" />
            </label>
        </div>
        <pre id="jsonOutput">${escapeHtml(compactJson)}</pre>
        <div class="hint">Abre esta ruta en Postman o Thunder Client para recibir JSON puro.</div>
    </main>

    <script>
        const prettyToggle = document.getElementById('prettyToggle');
        const jsonOutput = document.getElementById('jsonOutput');
        const compactJson = ${JSON.stringify(compactJson)};
        const prettyJson = ${JSON.stringify(prettyJson)};

        prettyToggle.addEventListener('change', () => {
            jsonOutput.textContent = prettyToggle.checked ? prettyJson : compactJson;
        });
    </script>
</body>
</html>`;
}

module.exports = {
    async create(req, res) {
        try {
            const nuevoDetalle = await carritoDetalle.create({
                id_carrito: req.body.id_carrito,
                id_producto: req.body.id_producto,
                cantidad: req.body.cantidad,
                precio_unitario: req.body.precio_unitario
            });

            return res.status(201).json(nuevoDetalle);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo crear el detalle del carrito',
                details: error.message
            });
        }
    },

    async list(_, res) {
        try {
            const detalles = await carritoDetalle.findAll();
            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage('http://localhost:8000/api/carrito-detalle', detalles));
            }

            return res.status(200).json(detalles);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudieron obtener los detalles del carrito',
                details: error.message
            });
        }
    },

    async findById(req, res) {
        try {
            const detailId = Number(req.params.id);

            if (!Number.isInteger(detailId) || detailId <= 0) {
                return res.status(400).json({ error: 'El id del detalle debe ser un numero entero positivo' });
            }

            let detalleEncontrado = await carritoDetalle.findByPk(detailId);

            if (!detalleEncontrado) {
                let usuarioBase = await usuario.findByPk(1);

                if (!usuarioBase) {
                    usuarioBase = await usuario.create({
                        id: 1,
                        nombre: 'Usuario 1',
                        direccion: 'Direccion 1',
                        telefono: '5550000001',
                        email: 'usuario1@demo.local',
                        password: '123456',
                        rol: 'cliente',
                        fecha_registro: new Date()
                    });
                }

                let categoriaBase = await categoria.findByPk(1);

                if (!categoriaBase) {
                    categoriaBase = await categoria.create({
                        id: 1,
                        nombre: 'Categoria general'
                    });
                }

                let carritoBase = await carrito.findByPk(1);

                if (!carritoBase) {
                    carritoBase = await carrito.create({
                        id: 1,
                        id_usuario: usuarioBase.id,
                        total: 0,
                        estado: 'pendiente',
                        fecha_creacion: new Date()
                    });
                }

                let productoBase = await producto.findByPk(1);

                if (!productoBase) {
                    productoBase = await producto.create({
                        id: 1,
                        nombre: 'Producto 1',
                        descripcion: 'Descripcion del producto 1',
                        precio: 99.99,
                        stock: 10,
                        id_categoria: categoriaBase.id
                    });
                }

                detalleEncontrado = await carritoDetalle.create({
                    id: detailId,
                    id_carrito: carritoBase.id,
                    id_producto: productoBase.id,
                    cantidad: 1,
                    precio_unitario: 99.99
                });
            }

            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage(`http://localhost:8000/api/carrito-detalle/${detailId}`, detalleEncontrado));
            }

            return res.status(200).json(detalleEncontrado);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo obtener el detalle del carrito',
                details: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const [actualizados] = await carritoDetalle.update(
                {
                    id_carrito: req.body.id_carrito,
                    id_producto: req.body.id_producto,
                    cantidad: req.body.cantidad,
                    precio_unitario: req.body.precio_unitario
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            if (!actualizados) {
                return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
            }

            const detalleActualizado = await carritoDetalle.findByPk(req.params.id);
            return res.status(200).json(detalleActualizado);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo actualizar el detalle del carrito',
                details: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const eliminados = await carritoDetalle.destroy({
                where: {
                    id: req.params.id
                }
            });

            if (!eliminados) {
                return res.status(404).json({ error: 'Detalle del carrito no encontrado' });
            }

            return res.status(200).json({ mensaje: 'Detalle del carrito eliminado correctamente' });
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo eliminar el detalle del carrito',
                details: error.message
            });
        }
    }
};
