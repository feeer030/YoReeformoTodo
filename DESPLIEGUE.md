# 🚀 Guía de Despliegue: YoReformoTodo

Este documento te guiará para subir tu web de reformas a internet de forma gratuita.

## Paso 1: Subir el código a GitHub
1. Crea una cuenta en [GitHub](https://github.com) si no la tienes.
2. Crea un nuevo repositorio llamado `yoreformotodo`.
3. Sube todos los archivos de tu carpeta `html_version` al repositorio.

## Paso 2: Desplegar en Render.com
1. Ve a [Render.com](https://render.com) y crea una cuenta (puedes usar tu cuenta de GitHub).
2. Pulsa el botón **"New +"** y selecciona **"Web Service"**.
3. Conecta tu cuenta de GitHub y elige el repositorio `yoreformotodo`.
4. Configura los siguientes campos:
   - **Name:** `yoreformotodo` (o el que quieras).
   - **Region:** Elige la más cercana a ti.
   - **Branch:** `main` (o la que hayas usado).
   - **Runtime:** `Node`.
   - **Build Command:** `npm install --prefix server`
   - **Start Command:** `node server/index.js`
5. Pulsa en **"Create Web Service"**.

## Paso 3: ¡A disfrutar!
En unos minutos, Render te dará una URL (ej: `yoreformotodo.onrender.com`). ¡Esa es tu dirección oficial en internet!

---

## 💡 Recomendación para el futuro
Actualmente usamos **SQLite**, lo que significa que si el servidor de Render se duerme o reinicia, los contactos captados podrían borrarse. 

**Si vas a usar esto para clientes reales**, dímelo y te ayudaré a conectar una base de datos profesional gratuita (como Supabase o Vercel Postgres) que nunca borra nada.

¡Mucha suerte con tu proyecto! 🚀
