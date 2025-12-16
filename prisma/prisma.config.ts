// Esta configuración se utiliza para que Prisma CLI sepa
// cómo conectarse a la base de datos para comandos como `migrate` y `db pull`.
const config = {
  // Define la URL de la base de datos para el entorno de desarrollo.
  // Es crucial que esta URL refleje el `provider` que definiste en schema.prisma (sqlite, postgres, etc.).
  // Utilizamos `process.env.DATABASE_URL` para seguir usando la variable de entorno.
  db: {
    url: process.env.DATABASE_URL || 'file:./dev.db', // Asegúrate de que el fallback sea correcto para tu proveedor (ej. 'postgresql://...')
  },
};

export default config;