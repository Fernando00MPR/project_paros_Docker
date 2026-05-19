# ── Imagen base ───────────────────────────────────────────────────────────────
FROM python:3.11-slim-bookworm

# Evita archivos .pyc y buffers en stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ── Directorio de trabajo ──────────────────────────────────────────────────────
WORKDIR /app

# ── Dependencias del sistema (libpq para PostgreSQL) ──────────────────────────
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ── Dependencias de Python ─────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# ── Código fuente ──────────────────────────────────────────────────────────────
COPY . .

# ── Archivos estáticos ─────────────────────────────────────────────────────────
RUN python manage.py collectstatic --noinput || true

# ── Puerto expuesto ────────────────────────────────────────────────────────────
EXPOSE 8000

# ── Comando de inicio con Gunicorn ────────────────────────────────────────────
CMD ["gunicorn", "paros_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
