const { Client } = require('pg');

// Configuración de conexión
const dbConfig = {
    user: process.env.DB_USER,        // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    host: process.env.DB_SERVER,      // Dirección del servidor
    database: process.env.DB_NAME,    // Nombre de la base de datos
    port: process.env.DB_PORT || 5432 // Puerto del servidor (por defecto 5432)
};

// Crear cliente global
const client = new Client(dbConfig);

// Conectar al servidor de PostgreSQL
const connectDB = async () => {
    try {
        if (!client._connected) { // Evitar múltiples conexiones
            await client.connect();
            console.log('Connected to the PostgreSQL database.');
        }
    } catch (err) {
        console.error('Error connecting to the PostgreSQL database:', err);
        throw err;
    }
};

module.exports = { sql: client, connectDB };
