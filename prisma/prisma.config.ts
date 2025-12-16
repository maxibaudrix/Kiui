// Este archivo de configuración es requerido por Prisma CLI v7.x para
// comandos como `migrate dev`, ya que la URL de conexión se ha movido
// fuera de `schema.prisma`.

export default {
  // Contiene todas las fuentes de datos definidas en schema.prisma
  datasources: {
    // 'db' debe coincidir con el nombre de tu `datasource` en schema.prisma.
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db', 
    },
  },
};