# 🛠️ Guía Operativa: Vulnerabilidades OWASP Intencionales

Documento interno para recrear, verificar y documentar las vulnerabilidades pactadas para el backend del e-commerce **Mandarin Store**. Cada sección resume el objetivo, modificaciones puntuales, pasos de prueba y evidencia que debe archivarse en `docs/`.

> ⚠️ Ejecutar únicamente en entornos de laboratorio. Mantener el código vulnerable aislado de producción y dejar clara su finalidad académica en los commits.

---

## 1. NoSQL Injection · `POST /api/users/login` (A03:2021 – Injection)

**Objetivo:** permitir autenticarse enviando operadores MongoDB en lugar de credenciales reales.

### Implementación
1. En `src/controllers/auth.js`, mantener la lógica actual que hace `User.findOne({ username: req.body.username, password: req.body.password })`.
2. **No** validar tipos ni sanitizar `req.body`. Permitir que `username` y `password` lleguen como objetos (`{"$ne": null}`).
3. Opcional: desactivar logs o rate limiting para que la explotación sea visible sin ruido.

### Explotación desde la UI
1. Levanta backend y frontend (`npm run dev` en `mandarin-store-frontend`).
2. Abre `http://localhost:5173/login`, ingresa cualquier usuario/contraseña y envía el formulario para que aparezca la petición `POST /api/users/login` en la pestaña **Network**.
3. En Chrome/Edge, haz clic derecho sobre la petición → **Edit and Resend** (o **Replay XHR**) y cambia el cuerpo por:
   ```json
   {"username":{"$ne":null},"password":{"$ne":null}}
   ```
4. Reenvía la solicitud desde el mismo panel; vuelve a la pestaña **Application** y confirma que el frontend te considera autenticado (se setea el usuario en `localStorage` y la UI muestra el estado logueado) aun sin credenciales válidas.

### Evidencia requerida
- Captura del request/response en terminal.
- Fragmento de código (`auth.js`) señalando la consulta vulnerable.

---

## 2. Sensitive Data Exposure · Passwords en texto plano (A02:2021 – Cryptographic Failures)

**Objetivo:** almacenar `password` sin hashing para mostrar la falla.

### Implementación
1. En `src/models/User.js`, definir el esquema con `password: String` sin middleware `pre('save')` de hashing.
2. En el controlador de registro (`src/controllers/auth.js`), guardar `req.body.password` directamente.
3. Evitar dependencias como `bcrypt`. Comentar explícitamente que “se omite hashing” para fines académicos.

### Explotación desde la UI / URL
1. Crea usuarios desde `http://localhost:5173/register` (el Network inspector mostrará el `_id` y la contraseña enviada).
2. Sin necesidad de CLI, abre una nueva pestaña del navegador y solicita `http://localhost:3000/api/users`; el endpoint expone todo el listado en JSON e incluye los campos `password` en texto plano.
3. Alternativamente, inicia sesión como admin en `http://localhost:5173/login`, visita `http://localhost:5173/admin/users`, inspecciona la petición `GET /api/users` y observa en la respuesta las contraseñas originales.

### Evidencia requerida
- Captura de la colección mostrando el campo `password`.
- Snippet del modelo resaltando la falta de hashing.

---

## 3. Broken Access Control / IDOR · `userId` y `orderId` (A01:2021 – Broken Access Control)

**Objetivo:** permitir que cualquier usuario manipule recursos ajenos enviando IDs arbitrarios.

### Implementación
1. En `src/routes/cart.js` y `src/routes/orders.js`, **no** filtrar por el `userId` del token ni validar ownership.
2. Exponer rutas como:
   - `GET /api/cart/:userId`
   - `PUT /api/orders/:orderId`
3. Evitar middlewares de autenticación o, si existen, que solo verifiquen que el token es válido pero no el dueño del recurso.

### Explotación desde la UI / URLs
1. Desde `http://localhost:5173/register`, crea dos cuentas (víctima y atacante) y agrega productos al carrito de la víctima mediante el flujo normal (`/product/:id` → “Agregar al carrito”).
2. Obtén el `userId` de la víctima abriendo DevTools en la pantalla de registro o, si estás logueado como admin, desde `http://localhost:5173/admin/users` (la respuesta de `GET /api/users` lista los `_id`).
3. Con la sesión del atacante activa, abre una pestaña nueva y visita `http://localhost:3000/api/cart/<victimId>`: el backend devuelve el carrito ajeno sin validar que seas el propietario.
4. Para las órdenes, copia cualquier `orderId` que aparezca en `http://localhost:5173/admin/orders`, vuelve al navegador con la sesión atacante, abre DevTools → pestaña **Console** y ejecuta:
   ```javascript
    fetch("http://localhost:3000/api/orders/<orderId>", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" })
    });
   ```
   El endpoint acepta el cambio y la próxima carga de `/orders` refleja la modificación no autorizada.

### Evidencia requerida
- Capturas del request mostrando que se entregan datos de la víctima.
- Código del handler que omite la verificación del propietario.

---

## 4. Stored XSS · Campos `description` / `comment` (A03:2021 – Injection)

**Objetivo:** permitir que HTML arbitrario se persista y se renderice en el frontend.

### Implementación
1. En `src/models/Product.js` y `src/models/Review.js`, definir campos string sin sanitización.
2. En controladores (`product.js`, `review.js`), guardar `req.body.description` y `req.body.comment` sin limpieza (no usar DOMPurify ni validaciones).
3. En endpoints de obtención, retornar las cadenas tal cual para que el frontend las pinte con `dangerouslySetInnerHTML` o equivalente (ya ocurre en React si se insertan sin escape).

### Explotación desde la UI
1. Ingresa como cualquier usuario y ve a `http://localhost:5173/product/<id>` para dejar una reseña, o como admin a `http://localhost:5173/admin/products` para crear/editar un producto.
2. En el campo `Descripción` o `Comentario`, pega un payload como `<script>alert("xss")</script>` y guarda.
3. Abre nuevamente la ficha del producto (`/product/<id>`) o la lista de reseñas (`/reviews`); el HTML se imprime tal cual y el `alert` se dispara en cualquier navegador que visite la página.

### Evidencia requerida
- Video/gif corto del popup ejecutándose.
- Código mostrando ausencia de sanitización.

---

## 5. Security Misconfiguration · CORS/Headers (A05:2021 – Security Misconfiguration)

**Objetivo:** permitir que cualquier origen consuma la API y exponer endpoints sin cabeceras de seguridad.

### Implementación
1. En `src/index.js`, configurar `app.use(cors())` sin opciones (lo que equivale a `Access-Control-Allow-Origin: *`).
2. No montar Helmet ni cabeceras personalizadas.
3. Asegurarse de que endpoints sensibles (`/api/orders`) respondan datos valiosos para la demo.

### Explotación desde otra página
1. Crea un archivo `exploit.html` (puede estar en el escritorio) con:
   ```html
   <script>
     fetch("http://localhost:3000/api/orders")
       .then((r) => r.json())
       .then((d) => document.body.innerText = JSON.stringify(d, null, 2));
   </script>
   ```
2. Ábrelo directamente con `file:///.../exploit.html` o sirviéndolo con `npx http-server`. Aunque proviene de otro origen, el navegador completará la petición porque el backend tiene CORS abierto (`*`) y no aplica headers estrictos (sin Helmet).
3. Observa que la página externa muestra las órdenes completas sin haber pasado por la aplicación oficial.

### Evidencia requerida
- Captura del exploit mostrando órdenes.
- Fragmento de `index.js` con `cors()` sin restricciones.

---

## 6. Insecure File Upload · `POST /api/products` (A04:2021 – Insecure Design)

**Objetivo:** aceptar cualquier archivo como imagen de producto sin validar MIME, tamaño ni ubicación.

### Implementación
1. En `src/controllers/product.js`, utilizar `multer` (o similar) con una configuración básica que guarde en `/uploads/products`.
2. No definir `fileFilter`, límite de tamaño (`limits`) ni listas blancas de extensiones.
3. Permitir servir los archivos subidos estáticamente (`app.use('/uploads', express.static(...))`).

### Explotación desde la UI
1. Ingresa al panel en `http://localhost:5173/admin/products` y crea/edita un producto.
2. En el campo de imagen, selecciona cualquier archivo peligroso (`payload.html`, `.php`, `.exe`). El formulario acepta cualquier extensión porque el backend no valida el MIME.
3. Guarda el producto y copia la URL pública que genera el frontend (`http://localhost:3000/uploads/products/<nombre>`). Al abrir ese enlace en el navegador descargarás/ejecutarás el payload subido.

### Evidencia requerida
- Screenshot del archivo listado en `/uploads`.
- Código del controlador mostrando la falta de validaciones.

---

## 7. Authentication Failures (Extra) · Login sin rate limiting (A07:2021 – Identification & Authentication Failures)

**Objetivo:** permitir ataques de fuerza bruta ilimitados sobre el endpoint de login.

### Implementación
1. Garantizar que `POST /api/users/login` solo valide credenciales y devuelva tokens; no añadir CAPTCHAs, delays ni bloqueos.
2. Evitar middleware como `express-rate-limit`.
3. Opcional: loggear cada intento para mostrar la cantidad de requests durante la defensa.

### Explotación desde la UI
1. Abre `http://localhost:5173/login` y abre la consola (F12 → **Console**).
2. Identifica un `username` existente (puedes verlo en `/admin/users` o preguntarle a la víctima).
3. Pega y ejecuta en la consola:
   ```javascript
   setInterval(() => {
     fetch("http://localhost:3000/api/users/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         username: "victim",
         password: Math.random().toString(16).slice(2, 6),
       }),
     });
   }, 300);
   ```
4. El navegador seguirá enviando intentos infinitos desde la misma pestaña porque no existe rate limiting; en los logs del backend se observarán miles de peticiones sin bloqueo.

### Evidencia requerida
- Clip del script corriendo por varios segundos.
- Indicar ausencia de rate limiting en el código del router/controller.

---

## Checklist de Documentación

- [ ] Registrar cada vulnerabilidad en `docs/vuln_catalog.md` con: descripción, riesgo, archivo implicado, exploit y mitigación propuesta.
- [ ] Guardar capturas/videos en `docs/evidence/<vuln-xx>/`.
- [ ] Referenciar commits específicos donde se introducen las vulnerabilidades (mensaje claro: `feat(vuln): enable NoSQL injection`).
- [ ] Actualizar README general con enlace a este documento cuando el backend esté listo.

Con esta guía, cualquier miembro del equipo puede reproducir y demostrar cada vulnerabilidad siguiendo pasos consistentes y con evidencia preparada para la defensa.
