# Tienda Virtual API

API REST para administrar categorias, productos, carritos y detalles del carrito.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm start
```

Para desarrollo con recarga automatica:

```bash
npm run dev
```

El servidor inicia en `http://localhost:8000` por defecto.

## Verificacion rapida

Para comprobar que las rutas quedaron cargadas:

- `GET http://localhost:8000/api`
- `GET http://localhost:8000/api/categorias`
- `GET http://localhost:8000/api/productos`
- `GET http://localhost:8000/api/carrito`
- `GET http://localhost:8000/api/carrito-detalle`

## Endpoints principales

- `GET /api/categorias`
- `GET /api/categorias/:id`
- `POST /api/categorias`
- `PUT /api/categorias/:id`
- `DELETE /api/categorias/:id`
- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`
- `GET /api/carrito`
- `GET /api/carrito/:id`
- `POST /api/carrito`
- `PUT /api/carrito/:id`
- `DELETE /api/carrito/:id`
- `GET /api/carrito-detalle`
- `GET /api/carrito-detalle/:id`
- `POST /api/carrito-detalle`
- `PUT /api/carrito-detalle/:id`
- `DELETE /api/carrito-detalle/:id`

## Estructura

- `app.js`: punto de entrada del servidor.
- `routes/`: definicion de rutas.
- `controllers/`: logica de negocio.
- `models/`: modelos de Sequelize.
- `migrations/`: migraciones de base de datos.
