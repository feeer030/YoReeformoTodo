# 🛠️ Configuración de YoReformoTodo en Hostinger

Como hemos configurado un sistema híbrido, tu web funcionará perfectamente en Hostinger siguiendo estos pasos.

## Paso 1: Crear la Base de Datos en Hostinger
1. Entra en tu **hPanel** de Hostinger.
2. Ve a **Bases de Datos -> Bases de Datos MySQL**.
3. Crea una nueva base de datos y un usuario (apunta el nombre de la DB, usuario y contraseña).

## Paso 2: Subir el Código
Puedes usar el Administrador de Archivos de Hostinger para subir toda la carpeta del proyecto.

## Paso 3: Configurar Node.js en Hostinger
1. En el panel de Hostinger, busca la sección **"Advanced" -> "Node.js"**.
2. Selecciona la carpeta donde subiste la web.
3. Elige la versión de Node más reciente disponible.
4. En **"Environment Variables"**, añade estas 4 variables con tus datos de la base de datos que creaste en el Paso 1:
   - `DB_HOST`: Normalmente `localhost` o el host que te dé Hostinger.
   - `DB_USER`: Tu usuario de MySQL.
   - `DB_PASSWORD`: Tu contraseña de MySQL.
   - `DB_NAME`: El nombre de la base de datos.
5. Haz clic en **"Install dependencies"** (esto instalará MySQL automáticamente).
6. Haz clic en **"Start"**.

## Paso 4: ¡Web en Vivo!
Hostinger te dará la URL de tu dominio. ¡Tu chat inteligente y tu CRM ya estarán funcionando en la nube con una base de datos profesional e indestructible! 🚀
