// Este archivo configura la URL de conexión para la CLI de Prisma (migrate, db push, etc.).

const config = {
  // La CLI espera la configuración bajo la propiedad 'datasources'.
  datasources: {
    // 'db' debe coincidir con el nombre de tu `datasource` en schema.prisma.
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db', 
    },
  },
};

export default config;