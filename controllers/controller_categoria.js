const db = require('../models');
const categoria = db.tbc_categoria;

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
                <span>Impresion con formato estilístico</span>
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
            const nuevaCategoria = await categoria.create({
                nombre: req.body.nombre
            });

            return res.status(201).json({
                id: nuevaCategoria.id,
                nombre: nuevaCategoria.nombre,
                updatedAt: nuevaCategoria.updatedAt,
                createdAt: nuevaCategoria.createdAt
            });
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo crear la categoria',
                details: error.message
            });
        }
    },

    async list(_, res) {
        try {
            const categorias = await categoria.findAll();
            const acceptHeader = res.req.get('accept') || '';

            if (acceptHeader.includes('text/html')) {
                return res.status(200).send(renderJsonPage('http://localhost:8000/api/categorias', categorias));
            }

            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudieron obtener las categorias',
                details: error.message
            });
        }
    },

    async find(req, res) {
        try {
            const categorias = await categoria.findAll({
                where: {
                    nombre: req.params.nombre
                }
            });

            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo buscar la categoria',
                details: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const eliminados = await categoria.destroy({
                where: {
                    id: req.params.id
                }
            });

            if (!eliminados) {
                return res.status(404).json({ error: 'Categoria no encontrada' });
            }

            return res.status(200).json({ mensaje: 'Datos eliminados correctamente' });
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo eliminar la categoria',
                details: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const [actualizados] = await categoria.update(
                {
                    nombre: req.body.nombre
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            if (!actualizados) {
                return res.status(404).json({ error: 'Categoria no encontrada' });
            }

            const categoriaActualizada = await categoria.findByPk(req.params.id);
            return res.status(200).json(categoriaActualizada);
        } catch (error) {
            return res.status(400).json({
                error: 'No se pudo actualizar la categoria',
                details: error.message
            });
        }
    }
};
