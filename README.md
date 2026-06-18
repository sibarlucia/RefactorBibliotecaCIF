# Biblioteca Virtual CIF — Guía de despliegue

## Estructura del proyecto

```
BibliotecaCIF/
├── BackCatalogo/          # API REST (Node.js + Express + MongoDB)
│   ├── middleware/
│   │   └── auth.js        # Verifica JWT en rutas protegidas
│   ├── models/
│   │   └── modelsLibros.js
│   ├── routes/
│   │   ├── routesAuth.js  # POST /api/auth/login → devuelve JWT
│   │   └── routesLibros.js# GET público; POST/PATCH/DELETE protegidos con JWT
│   ├── server.js
│   ├── package.json
│   └── .env               # Credenciales (NO subir a git)
│
├── FrontCatalogo/         # React + Vite
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Manejo de sesión JWT
│   │   ├── components/
│   │   │   ├── Login.jsx         # Formulario de login
│   │   │   ├── Admin.jsx         # CRUD de libros (protegido)
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── buscador.jsx      # Catálogo público
│   │   ├── hooks/
│   │   │   └── useLibros.js
│   │   └── App.jsx
│   ├── vite.config.js
│   └── .env
│
├── nginx/
│   └── biblioteca-cif.conf  # Config Nginx para producción
└── ecosystem.config.cjs     # Config PM2
```

---

## Flujo de seguridad JWT

```
1. Admin navega a /admin
2. ProtectedRoute detecta que no hay token → redirige a /login
3. Admin ingresa usuario y contraseña
4. POST /api/auth/login → el backend verifica credenciales con bcrypt
5. Si son correctas, devuelve un JWT firmado (expira en 8h por defecto)
6. El frontend guarda el token en localStorage
7. Todas las peticiones POST/PATCH/DELETE incluyen: Authorization: Bearer <token>
8. El middleware auth.js verifica la firma y expiración antes de continuar
```

---

## Entorno local (desarrollo)

### 1. Backend

```bash
cd BackCatalogo
npm install
```

Editá `.env` y actualizá los valores que correspondan. En particular:

```
# Generar un hash bcrypt para la contraseña del admin:
node -e "require('bcryptjs').hash('TuNuevaContraseña', 10).then(h => console.log(h))"
```

Pegá el hash resultante en `ADMIN_PASSWORD_HASH`.

```bash
npm run dev      # nodemon server.js → http://localhost:3001
```

### 2. Frontend

```bash
cd FrontCatalogo
npm install
npm run dev      # vite → http://localhost:3000
```

El proxy de Vite redirige `/api/*` → `http://localhost:3001`.

### 3. Acceso

| URL                        | Descripción              |
|---------------------------|--------------------------|
| http://localhost:3000/     | Catálogo público         |
| http://localhost:3000/login| Login admin              |
| http://localhost:3000/admin| Panel admin (protegido)  |

---

## Producción en Ubuntu con Nginx

### Prerequisitos

```bash
sudo apt update && sudo apt install -y nodejs npm nginx
npm install -g pm2
```

### 1. Configurar variables de entorno del backend

```
# En /var/www/biblioteca-cif-backend/BackCatalogo/.env:
NODE_ENV=production
DATABASE_URL=<tu_mongo_atlas_url>
JWT_SECRET=<cadena_aleatoria_larga_y_segura>
JWT_EXPIRES_IN=8h
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<hash_bcrypt>
FRONTEND_URL=https://tu-dominio.com
PORT=3001
```

### 2. Compilar el frontend

```bash
cd FrontCatalogo
# El frontend en producción usa Nginx como proxy hacia /api, no Vite
npm run build
# Copiar el build al directorio servido por Nginx
sudo cp -r dist/* /var/www/biblioteca-cif/
```

### 3. Instalar y arrancar el backend con PM2

```bash
cd /var/www/biblioteca-cif-backend/BackCatalogo
npm install --omit=dev
pm2 start /ruta/al/ecosystem.config.cjs
pm2 save
pm2 startup    # Sigue las instrucciones para habilitarlo como servicio
```

### 4. Configurar Nginx

```bash
sudo cp nginx/biblioteca-cif.conf /etc/nginx/sites-available/biblioteca-cif
# Editá el archivo y reemplazá "tu-dominio.com" por tu dominio o IP
sudo nano /etc/nginx/sites-available/biblioteca-cif

sudo ln -s /etc/nginx/sites-available/biblioteca-cif /etc/nginx/sites-enabled/
sudo nginx -t                   # Verificar sintaxis
sudo systemctl reload nginx
```

### 5. (Recomendado) Certificado HTTPS con Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
# Descomentá el bloque HTTPS en nginx/biblioteca-cif.conf después
```

### 6. Verificar que todo funciona

```bash
pm2 status                       # Backend corriendo
sudo systemctl status nginx      # Nginx activo
curl http://localhost:3001/api/libros   # Respuesta JSON del backend
```

---

## Endpoints de la API

| Método | Ruta                  | Auth | Descripción               |
|--------|-----------------------|------|---------------------------|
| POST   | /api/auth/login       | No   | Devuelve JWT              |
| GET    | /api/libros           | No   | Lista todos los libros    |
| GET    | /api/libros/:id       | No   | Obtiene un libro          |
| POST   | /api/libros           | JWT  | Crea un libro             |
| PATCH  | /api/libros/:id       | JWT  | Actualiza campos parciales|
| DELETE | /api/libros/:id       | JWT  | Elimina un libro          |

---

## Cambiar la contraseña del admin

1. Generá un nuevo hash:
   ```bash
   node -e "require('bcryptjs').hash('NuevaContraseña', 10).then(h => console.log(h))"
   ```
2. Pegá el resultado en `ADMIN_PASSWORD_HASH` del `.env`.
3. Reiniciá el backend: `pm2 restart biblioteca-cif-backend`
