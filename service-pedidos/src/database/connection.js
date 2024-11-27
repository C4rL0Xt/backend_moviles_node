import pkg from 'pg'; // Importar todo el paquete `pg`
const { Client } = pkg; // Desestructurar para obtener `Client`

export const dbSettings = {
  user: "postgres",
  password: "12345",
  host: "localhost",
  database: "BBraunDatabase",
  port: process.env.DB_PORT || 5432,
};

export const getConnection = async () => {
  const client = new Client(dbSettings);  // Crear una nueva instancia de Client con la configuración
  try {
    await client.connect();  // Establecer la conexión con PostgreSQL
    console.log("Conexión exitosa a la base de datos PostgreSQL");
    return client;  // Devolver el cliente para usarlo en consultas
  } catch (error) {
    console.error("Error al conectar a PostgreSQL:", error);
    throw error; // Lanza el error para manejarlo donde se llame a la función
  }
};
