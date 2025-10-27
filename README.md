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