<h1 align="center"><strong>ServiceFlow — Gestión de Solicitudes Internas</strong></h1>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./photos/serviceflow-logo.svg">
    <source media="(prefers-color-scheme: light)" srcset="./photos/serviceflow-logo-light.svg">
    <img src="./photos/serviceflow-logo-light.svg" alt="ServiceFlow" width="400">
  </picture>
</p>

<div align="center">
<p>Sistema centralizado para registrar, atender y medir solicitudes internas.</p>
<br>
</div>

---

## 📌 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Demostración y Despliegue](#-demostración-y-despliegue)
- [Tech Stack](#-tech-stack)
- [Funcionalidades del MVP](#-funcionalidades-del-mvp)
- [Arquitectura de Datos (DER)](docs/DER.md)
- [Endpoints Principales (API)](#-endpoints-principales-api)
- [Instalación y Configuración Local](#-instalación-y-configuración-local)
- [Credenciales de Prueba (Seed Data)](#-credenciales-de-prueba-seed-data)
- [Guía de Uso Rápido (3 Minutos)](docs/GUIA_RAPIDA.md)
- [Manual de Usuario por Roles](docs/MANUAL_USUARIO.md)
- [Equipo de Desarrollo](#-equipo-de-desarrollo)

---

## 📖 Acerca del Proyecto

### 🔴 El Problema

Las solicitudes internas de IT y otras áreas suelen llegar por correos, chats y planillas. Al estar repartidas entre distintos canales, se pierde trazabilidad y aumenta el riesgo de que queden sin registrar, responsable o seguimiento. También resulta difícil priorizar, controlar los SLA y las aprobaciones, consultar el conocimiento disponible y medir el desempeño de los equipos.

La organización necesita un registro único para saber quién solicitó qué, quién lo gestiona, en qué estado está y si se resolverá dentro del tiempo esperado.

### 🟢 La Solución (ServiceFlow)

ServiceFlow centraliza cada solicitud en un ticket con responsable, prioridad, historial y SLA, y permite seguir su atención hasta la resolución y el cierre.

---

## 🎬 Demostración y Despliegue

- **App web:** [ServiFlow](https://s08-26-equipo-7.vercel.app/)
- **API Backend:** Pendiente de despliegue; en local: `http://localhost:8080/api/v1`.
- **📹 Video Demo:** [https://youtu.be/EO09dTAKwcM](https://youtu.be/EO09dTAKwcM)

---

## 🛠️ Tech Stack

### Frontend

<div style="display:flex;flex-wrap:wrap;gap:8px;">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui">
</div>

- **Framework:** React 19.2.8
- **Estilos & UI:** Tailwind CSS 4.3.3 + shadcn/ui
- **Estado Global:** React Context (implícito)
- **Peticiones HTTP:** Fetch API (nativo)

### Backend

<div style="display:flex;flex-wrap:wrap;gap:8px;">
<img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</div>

- **Entorno de Ejecución:** Java 21 (OpenJDK)
- **Base de Datos & ORM:** PostgreSQL 17 + Spring Data JPA (Hibernate)
- **Autenticación:** JWT (HttpOnly cookie) + protección CSRF (XSRF-TOKEN)
- **Documentación:** API modular en Markdown (`backend/docs/`)

### DevOps & Tools

<div style="display:flex;flex-wrap:wrap;gap:8px;">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</div>

- **Deployment:** 
  - Frontend: Vercel (compatible con Vite)
  - Backend: Contenedor Docker (vía `docker-compose.yml`: servicio `api` build desde `./backend`, base de datos `db` con PostgreSQL)
  - Base de datos: Docker (PostgreSQL en compose)
- **Control de Versiones:** Git + GitHub
- **Repositorio:** `https://github.com/No-Country-simulation/S08-26-equipo-7.git`

---

## ✨ Funcionalidades del MVP

- ✅ **Gestión de tickets**: creación, visualización, actualización y cierre de solicitudes.
- ✅ **Flujo de trabajo automatizado**: auto‑clasificación, auto‑priorización, auto‑asignación y notificaciones.
- ✅ **Control de SLA**: monitoreo de tiempos de atención y resolución con escalado automático.
- ✅ **Base de conocimiento**: artículos de auto‑servicio con votos y contador de lecturas.
- ✅ **Roles y permisos**: cuatro roles diferenciados (Requester, Agent, Supervisor, Admin) con accesos específicos.
- ✅ **Autenticación segura**: login con JWT en cookie HttpOnly + protección CSRF.
- ✅ **Panel de administrador**: estadísticas, gestión de usuarios y categorías.

---

## 🗄️ Arquitectura de Datos (DER)

El diagrama entidad-relación está separado para que se visualice correctamente: [ver DER en `docs/DER.md`](docs/DER.md).

---

## 🔌 Endpoints Principales (API)

Base URL: `http://localhost:8080/api/v1`

| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|----------------|
| POST | `/api/v1/auth/login` | Autenticación de usuario (devuelve nombre y rol) | No |
| GET | `/api/v1/auth/csrf` | Obtiene token CSRF y cookie XSRF-TOKEN (necesario antes de POST) | No |
| POST | `/api/v1/auth/recover-password` | Genera ticket de recuperación de contraseña | No |
| GET | `/api/v1/auth/me` | Obtiene sesión actual | Sí (cookie access_token) |
| POST | `/api/v1/auth/logout` | Cierra sesión | Sí |
| GET | `/api/v1/categories` | Lista categorías activas | No |
| POST | `/api/v1/categories` | Crea nueva categoría | Sí (solo ADMIN) |
| GET | `/api/v1/tickets` | Lista tickets con filtros (estado, categoría, prioridad, búsqueda, paginación) | Sí |
| POST | `/api/v1/tickets` | Crea un ticket (auto‑clasificado, auto‑priorizado, auto‑asignado) | Sí |
| GET | `/api/v1/tickets/{id}` | Obtiene un ticket por ID | Sí |
| POST | `/api/v1/tickets/{id}/categorize` | Cambia categoría del ticket | Sí (AGENT/SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/prioritize` | Cambia prioridad y recalcula SLA | Sí (AGENT/SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/assign` | Asigna agente al ticket | Sí (SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/approve` | Aprueba ticket (si requiere aprobación) | Sí (SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/start` | Marca ticket como en progreso | Sí (AGENT/SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/resolve` | Resuelve ticket | Sí (AGENT/SUPERVISOR/ADMIN) |
| POST | `/api/v1/tickets/{id}/close` | Cierra ticket | Sí (REQUESTER/SUPERVISOR/ADMIN) |
| GET | `/api/v1/knowledge` | Lista artículos de conocimiento activos | No |
| POST | `/api/v1/knowledge` | Crea artículo de conocimiento | Sí (solo ADMIN) |
| GET | `/api/v1/notifications` | Lista notificaciones del usuario | Sí |
| GET | `/api/v1/tickets/stats/monthly` | Estadísticas mensuales | Sí |
| GET | `/api/v1/tickets/stats/summary` | Resumen de dashboard (activos, SLA, etc.) | Sí (ADMIN/SUPERVISOR) |

---

## ⚙️ Instalación y Configuración Local

### Pre‑requisitos

- Node.js (v18 o superior)
- Java JDK 21
- Docker y Docker Compose
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/No-Country-simulation/S08-26-equipo-7.git
cd S08-26-equipo-7
```

### 2. Configuración del Backend

```bash
cd backend
# Si existe un archivo .env.example, cópialo; de lo contrario, crea .env manualmente
cp .env.example .env   # Ignorar error si no existe
# Ejemplo de contenido mínimo para .env (ajustar según necesites):
# DB_URL=jdbc:postgresql://db:5432/serviceflow_db
# DB_USERNAME=postgres
# DB_PASSWORD=serviceflow_dev
# JWT_SECRET=tu_secreto_super_seguro
# JWT_EXPIRATION_MS=86400000
# ADMIN_PASSWORD_HASH=hash_de_contraseña_de_admin_bcrypt
```

**Ejecutar base de datos y servidor:**

```bash
# Levanta la base de datos y el backend mediante Docker Compose
docker-compose up -d   # Inicia ambos servicios (db y api) en segundo plano
# Esperar a que la base esté saludable; Flyway ejecutará migraciones al arranque del backend
# Ver logs: docker-compose logs -f api
```

> [!TIP]
> Si prefieres iniciar el backend directamente con Maven, primero asegúrate de que la base de datos esté en ejecución:
> ```bash
> ./mvnw spring-boot:run
> ```

### 3. Configuración del Frontend

```bash
cd ../frontend
npm install
# Crear .env con la variable del API del backend
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env
```

**Iniciar servidor de desarrollo:**

```bash
npm run dev   # Inicia Vite en http://localhost:5173
```

> [!IMPORTANT]
> El frontend consume la API en `http://localhost:8080/api/v1`. Inicia primero el backend; luego abre la aplicación en `http://localhost:5173`.

---

## 🔑 Credenciales de Prueba (Seed Data)

Credenciales tomadas de `backend\docs\03-usuarios.md` (usuarios de demostración para probar el login):

| Rol | Correo Electrónico | Contraseña |
|-----|--------------------|------------|
| ADMIN | `admin@serviceflow.com` | `admin123` |
| AGENT | `agente@serviceflow.com` | `agente123` |
| REQUESTER | `solicitante@serviceflow.com` | `solicitante123` |
| SUPERVISOR | `supervisor@serviceflow.com` | `supervisor123` |

*(Estas credenciales son válidas en el entorno de desarrollo. Los usuarios con dominio `@demo.com` se omitieron intencionalmente.)*

---

## ⚡ Guía de Uso Rápido (3 Minutos)
Consulta la [Guía de Uso Rápido](docs/GUIA_RAPIDA.md) para pasos concisos de prueba por rol.

---

## 📖 Manual de Usuario por Roles
Consulta el [Manual de Usuario por Roles](docs/MANUAL_USUARIO.md) para instrucciones detalladas por rol.

---

## 👥 Equipo de Desarrollo (No Country)

### ⚙️ BackEnd Developers

| <img src="./photos/santiago.jpg" width="100"> |
|:-:|
| **Santiago Río** |
| <a href="https://www.linkedin.com/in/santiago-ríos-018a2a406?utm_source=share_via&utm_content=profile&utm_medium=member_ios"><img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a> |
| <a href="https://github.com/santirios66"><img src="https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a> |

### 🎨 FrontEnd Developer

| <img src="./photos/Camilo.png" width="100"> |
|:-:|
| **Juan Camilo Garcia** |
| <a href="https://www.linkedin.com/in/juan-camilo-garcia-"><img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a> |
| <a href="https://github.com/SnackMasterDev"><img src="https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a> |

<div align="center"><strong>S08-26-equipo-7 - NoCountry 2026</strong></div>
