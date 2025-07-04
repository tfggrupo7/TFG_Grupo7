# ChefDesk

<p align="center">
  <img src="FRONTEND/public/icons/icon-192x192.png" alt="ChefDesk Logo" width="120" height="120">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19-red?logo=angular" alt="Angular">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Node.js-20.x-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.x-black?logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/SQLite-3-blue?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/PWA-yes-blueviolet?logo=pwa" alt="PWA">
  <img src="https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens" alt="JWT">
  <img src="https://img.shields.io/badge/Karma%20%2B%20Jasmine-Unit%20Tests-brightgreen?logo=Jasmine" alt="Karma Jasmine">
  <img src="https://img.shields.io/badge/Cypress-E2E%20Tests-6e5494?logo=cypress" alt="Cypress">
</p>

---

## 📚 Índice

- [ChefDesk](#chefdesk)
  - [📚 Índice](#-índice)
  - [Descripción](#descripción)
  - [Wiki](#wiki)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [💬 Integración del Chatbot de Soporte](#-integración-del-chatbot-de-soporte)
    - [🧩 Estructura](#-estructura)
    - [⚙️ Funcionamiento](#️-funcionamiento)
    - [🎨 Estilo personalizado](#-estilo-personalizado)
    - [📡 Requisitos de backend](#-requisitos-de-backend)
    - [🚀 Ejemplo de uso](#-ejemplo-de-uso)
  - [🎞️ Galería Multimedia](#️-galería-multimedia)
    - [Logo](#logo)
    - [Promo 1](#promo-1)
    - [Promo 2](#promo-2)
    - [Login](#login)
    - [Dashboard](#dashboard)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
      - [PWA](#pwa)
  - [🧪 Tests automatizados](#-tests-automatizados)
    - [Comandos útiles](#comandos-útiles)
  - [Integrantes del Proyecto](#integrantes-del-proyecto)

---

## Descripción

ChefDesk es una plataforma web todo-en-uno para la gestión eficiente de cocinas profesionales. Permite administrar inventario, personal, turnos, finanzas y mucho más, facilitando la digitalización y optimización de los procesos en restaurantes y negocios gastronómicos.

---

## Wiki

👉 [https://deepwiki.com/tfggrupo7/TFG_Grupo7](https://deepwiki.com/tfggrupo7/TFG_Grupo7)

---

## Tecnologías Utilizadas

### Backend

- **Node.js** y **Express.js**: Servidor y API REST.
- **Base de datos**: SQLite (archivos `.sqlite`, `.db`).
- **JWT**: Autenticación y autorización.
- **Módulos propios**: Controladores, modelos, rutas y middlewares para la gestión de usuarios, empleados, inventario, menús, pedidos, roles, tareas, etc.

### Frontend

- **Angular 19**: Framework principal para la SPA.
- **Tailwind CSS**: Estilizado moderno y utilidades CSS.
- **PWA**: Soporte para Aplicación Web Progresiva (manifest, service worker, iconos).
- **ngx-sonner**: Notificaciones.

---

## 💬 Integración del Chatbot de Soporte

Este proyecto incluye un **chatbot de soporte** desarrollado e integrado como **componente standalone en Angular 19**, permitiendo comunicación en tiempo real con un backend (basado en Node.js + Dialogflow).

### 🧩 Estructura

El componente está definido en:

```
src/app/chatbot-widget/
├── chatbot-widget.component.ts
├── chatbot-widget.component.html
├── chatbot-widget.component.css
```

Se importa en el componente raíz `AppComponent` usando la propiedad `standalone`.

### ⚙️ Funcionamiento

- Botón flotante con icono de chat para abrir/cerrar el contenedor.
- Animación suave con transición.
- Los mensajes del usuario y las respuestas se renderizan como *bocadillos ajustados* al texto.
- Soporte para:
  - Envío con tecla `Enter`.
  - Botón de enviar.
- Peticiones `POST` al backend en `/api/chat` incluyendo un `sessionId`.

### 🎨 Estilo personalizado

- Colores adaptados a la marca (`rgb(85 107 47)`).
- Diseño responsivo.
- Eliminación de decoraciones innecesarias (flecha, bordes excesivos).
- Uso de **Tailwind CSS** para una estética limpia y controlada.

### 📡 Requisitos de backend

El backend debe exponer una ruta:

```
POST /api/chat
Body: { message: string, sessionId: string }
Response: { reply: string }
```

### 🚀 Ejemplo de uso

El chatbot se encuentra activo en toda la aplicación, renderizado en `app.component.html` mediante:

```html
<chatbot-widget></chatbot-widget>
```

---

## 🎞️ Galería Multimedia

### Logo
![Logo](https://drive.google.com/uc?export=view&id=1DLTCfcHc8cIvldjxtFYurIRLKNMRU_D-)

### Promo 1
![Promo 1](https://drive.google.com/uc?export=view&id=1GZS_o_mEc2N6rrbjTK06tKpAEFQqEW9a)

### Promo 2
![Promo 2](https://drive.google.com/uc?export=view&id=1IxBAtNfzxRcVAF4dPsZGIn1Wxlbv3CWs)

### Login
![Login](https://drive.google.com/uc?export=view&id=1uQmoGik0UqJJfBkxp60KrMBb8I-xv1zT)

### Dashboard
![Dashboard](https://drive.google.com/uc?export=view&id=1LqN-CmxJpk0Y4TqXnMFDzIbBdIazJyDv)

---

## Estructura del Proyecto

```
BACKEND/
  src/
    controllers/   # Lógica de negocio y endpoints
    models/        # Modelos de datos
    routes/        # Rutas de la API
    middleware/    # Middlewares de autenticación y validación
    config/        # Configuración de la base de datos
    helper/        # Funciones auxiliares
    images/        # Imágenes del sistema
  app.js           # Punto de entrada del backend
  package.json     # Dependencias y scripts

FRONTEND/
  src/
    app/           # Componentes, páginas, servicios y rutas
    assets/        # Imágenes y recursos estáticos
    styles.css     # Estilos globales
  public/
    manifest.webmanifest  # Manifest PWA
    icons/                # Iconos PWA
  package.json     # Dependencias y scripts
  angular.json     # Configuración Angular
```

---

## Cómo ejecutar el proyecto

### Backend

1. Ve a la carpeta `BACKEND`:
   ```sh
   cd BACKEND
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Inicia el servidor:
   ```sh
   npm start     # o: npm run dev (modo desarrollo)
   ```

   El backend estará disponible en `http://localhost:3000`.

### Frontend

1. Ve a la carpeta `FRONTEND`:
   ```sh
   cd FRONTEND
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Inicia la aplicación Angular:
   ```sh
   npm start     # o: ng serve
   ```

   La app estará disponible en `http://localhost:4200`.

#### PWA

- Puedes instalar la app como PWA desde el navegador.
- El manifiesto y los iconos están en `public/`.

---

## 🧪 Tests automatizados

- **Unitarios:** con Karma + Jasmine (`ng test`)
- **End-to-End (E2E):** con Cypress (`npm run cypress:open`)

### Comandos útiles

```sh
# Ejecutar tests unitarios (Karma + Jasmine)
ng test

# Ejecutar tests E2E interactivos (Cypress)
npm run cypress:open
```

- Los tests unitarios cubren componentes, servicios y lógica de negocio Angular.
- Los tests E2E cubren flujos completos de usuario, login y vistas principales.

---

## Integrantes del Proyecto

- Bartolomé Miranda, Laura  
- Donoso Escalona, David  
- González Parra, Francisco  
- Ibañez Escribano, César  
- Mesa Gonzalez, Marcos  
- Moreno Vaz, Gilson Jorge  
- Pérez Mateos, Carlos  
- Rodríguez Hernández, Himar  
- Sendino Sanz, Rodrigo  

---

¡Gracias por usar ChefDesk!

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tfggrupo7/TFG_Grupo7)
