# Emergencias Contact API

API RESTful para gestionar una agenda de contactos con teléfonos, direcciones y registro de actividades.

## Stack tecnológico

- **Runtime:** Node.js con TypeScript
- **Framework:** Express 5
- **Base de datos:** PostgreSQL (via Docker)
- **ORM:** Prisma 7 (con `@prisma/adapter-pg`)
- **Validación:** Zod
- **Documentación:** Swagger UI (`/api-docs`)
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

## Requisitos previos

- Node.js v18+
- pnpm
- Docker

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Emergencias-challenge

# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Levantar la base de datos
docker compose up -d

# 5. Ejecutar migraciones
pnpm db:migrate

# 6. Poblar tipos de teléfono (mobile, home, work)
pnpm prisma db seed

# 7. Iniciar el servidor de desarrollo
pnpm dev
```

El servidor corre en `http://localhost:3000`.  
La documentación Swagger está disponible en `http://localhost:3000/api-docs`.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/emergencias_db` |
| `PORT` | Puerto del servidor | `3000` |

## Endpoints

### Contactos (Persons)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/persons` | Crear un contacto |
| `GET` | `/persons?email=` | Buscar por email (coincidencia exacta) |
| `GET` | `/persons?firstName=&lastName=&dateOfBirth=` | Buscar por datos personales |
| `GET` | `/persons?phoneNumber=&phoneTypeId=` | Buscar por número y tipo de teléfono |
| `PATCH` | `/persons/:id` | Editar datos personales |
| `DELETE` | `/persons/:id` | Eliminar un contacto |

### Actividades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/activities` | Crear una actividad |
| `GET` | `/activities?personId=&activityType=` | Buscar actividades por contacto y tipo |

Tipos de actividad: `call`, `meeting`, `email`.

### Ejemplo — crear un contacto

```json
POST /persons
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "dateOfBirth": "1990-01-15",
  "email": "juan@example.com",
  "phones": [
    { "number": "1123456789", "phoneTypeId": 1 }
  ],
  "addresses": [
    { "locality": "Buenos Aires", "street": "Corrientes", "number": 1234 }
  ]
}
```

### Ejemplo — crear una actividad

```json
POST /activities
{
  "personId": 1,
  "activityType": "call",
  "activityDate": "2024-01-15T10:30:00",
  "description": "Llamada de seguimiento"
}
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor en modo desarrollo con hot reload |
| `pnpm build` | Compila TypeScript |
| `pnpm start` | Inicia el servidor en producción |
| `pnpm test:run` | Ejecuta los tests |
| `pnpm test:coverage` | Ejecuta los tests con reporte de cobertura |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm db:migrate` | Ejecuta las migraciones de base de datos |
| `pnpm db:studio` | Abre Prisma Studio |
| `pnpm db:reset` | Resetea la base de datos |

## Esquema de base de datos

```
Person          Phone           PhoneType
──────────      ──────────      ──────────
id              id              id
firstName       number          typeName (único)
lastName        personId ──┐
dateOfBirth     phoneTypeId─┘
email (único)

Address         ContactActivity
──────────      ───────────────
id              id
personId        personId
locality        activityType (call | meeting | email)
street          activityDate
number          description
notes
```

Al eliminar un `Person` se eliminan en cascada sus teléfonos, direcciones y actividades ya que son entidades débiles.
