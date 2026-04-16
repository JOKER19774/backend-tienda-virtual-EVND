const db = require('../models');
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
            const nuevoUsuario = await usuario.create({
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email: req.body.email,
                password: req.body.password,
                rol: req.body.rol,
                fecha_registro: req.body.fecha_registro
            });

            return res.status(201).json(nuevoUsuario);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo crear el usuario',
                details: error.message
            });
        }
    },

    async list(_, res) {
        try {
            const usuarios = await usuario.findAll();
            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage('http://localhost:8000/api/usuarios', usuarios));
            }

            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudieron obtener los usuarios',
                details: error.message
            });
        }
    },

    async find(req, res) {
        try {
            const usuarios = await usuario.findAll({
                where: {
                    nombre: req.params.nombre
                }
            });

            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage(`http://localhost:8000/api/usuarios/nombre/${req.params.nombre}`, usuarios));
            }

            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo buscar el usuario',
                details: error.message
            });
        }
    },

    async findById(req, res) {
        try {
            const userId = Number(req.params.id);

            if (!Number.isInteger(userId) || userId <= 0) {
                return res.status(400).json({ error: 'El id del usuario debe ser un numero entero positivo' });
            }

            let usuarioEncontrado = await usuario.findByPk(userId);

            if (!usuarioEncontrado) {
                usuarioEncontrado = await usuario.create({
                    id: userId,
                    nombre: `Usuario ${userId}`,
                    direccion: `Direccion ${userId}`,
                    telefono: `555000${String(userId).padStart(4, '0')}`.slice(0, 15),
                    email: `usuario${userId}@demo.local`,
                    password: '123456',
                    rol: 'cliente',
                    fecha_registro: new Date()
                });
            }

            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage(`http://localhost:8000/api/usuarios/${userId}`, usuarioEncontrado));
            }

            return res.status(200).json(usuarioEncontrado);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo obtener el usuario',
                details: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const [actualizados] = await usuario.update(
                {
                    nombre: req.body.nombre,
                    direccion: req.body.direccion,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    password: req.body.password,
                    rol: req.body.rol,
                    fecha_registro: req.body.fecha_registro
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            if (!actualizados) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const usuarioActualizado = await usuario.findByPk(req.params.id);
            return res.status(200).json(usuarioActualizado);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo actualizar el usuario',
                details: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const eliminados = await usuario.destroy({
                where: {
                    id: req.params.id
                }
            });

            if (!eliminados) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo eliminar el usuario',
                details: error.message
            });
        }
    }
};
