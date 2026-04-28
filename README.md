# 🛑 Sistema de Registro de Paros de Producción

Sistema web desarrollado en Django para el registro, seguimiento y análisis de paros en líneas de producción.

---

## 📋 Requisitos previos

| Herramienta    | Versión mínima |
|----------------|----------------|
| Docker         | 24.x           |
| Docker Compose | 2.x            |
| Git            | 2.x            |

---

## ⚙️ Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/paros-produccion.git
cd paros-produccion
```

### 2. Crear el archivo de variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales:

```bash
nano .env   # o usa tu editor favorito
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Contiene credenciales sensibles.

### 3. Crear el archivo `requirements.txt`

Si no existe, genera uno desde tu entorno local:

```bash
pip freeze > requirements.txt
```

Asegúrate de que incluya al menos:

```
django>=4.2
psycopg2-binary
gunicorn
```

---

## 🐳 Ejecución con Docker

### Levantar todos los servicios

```bash
docker compose up --build
```

La aplicación estará disponible en: **http://localhost**

### Levantar en segundo plano

```bash
docker compose up --build -d
```

### Ver logs en tiempo real

```bash
docker compose logs -f
# Solo Django:
docker compose logs -f web
# Solo base de datos:
docker compose logs -f db
```

### Detener los servicios

```bash
docker compose down
```

### Detener y borrar la base de datos

```bash
docker compose down -v
```

---

## 🛠️ Comandos útiles de Django

```bash
# Aplicar migraciones manualmente
docker compose exec web python manage.py migrate

# Crear superusuario (administrador)
docker compose exec web python manage.py createsuperuser

# Generar nuevas migraciones tras cambios en modelos
docker compose exec web python manage.py makemigrations

# Abrir shell interactivo de Django
docker compose exec web python manage.py shell
```

---

## 🗄️ Acceso directo a la base de datos

```bash
docker compose exec db psql -U postgres -d paros_produccion
```

---

## 📁 Estructura del proyecto

```
Project/
├── paros_project/        # Configuración principal Django
│   ├── settings.py       # Variables de entorno, DB, apps instaladas
│   ├── urls.py           # Rutas raíz
│   ├── wsgi.py
│   └── asgi.py
├── paros_app/            # App principal: registro de paros
│   ├── models.py
│   ├── views/            # Vistas organizadas por módulo
│   │   ├── paros.py
│   │   ├── dashboard.py
│   │   ├── produccion.py
│   │   ├── exportacion.py
│   │   ├── autocomplete.py
│   │   └── catalogos/
│   ├── migrations/
│   └── urls.py
├── login_app/            # Autenticación y permisos
├── menu_app/             # Menú lateral dinámico
├── manage.py
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── requirements.txt
└── .env.example
```

---

## 🌐 URLs principales

| Ruta              | Descripción                  |
|-------------------|------------------------------|
| `/`               | Redirige al login            |
| `/login/`         | Inicio de sesión             |
| `/paros/`         | Dashboard principal          |
| `/admin/`         | Panel de administración      |

---

## 🔒 Notas de seguridad

- La sesión expira automáticamente después de **30 minutos** de inactividad.
- En producción asegúrate de que `DJANGO_DEBUG=False` en el `.env`.
- Cambia `DJANGO_SECRET_KEY` por una clave segura generada con:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🧪 Ejecución local sin Docker

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env con DB_HOST=localhost y tu PostgreSQL local
python manage.py migrate
python manage.py runserver
```

---

## 📄 Licencia

MIT © 2026
