const express = require('express');
const { connectDB, sql } = require('../database/config');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.facturaPath = '/facturas';
        this.facturaCompraPath = '/facturasCompra';
        this.conectarDB();
        this.middlewares();
        this.routes();

    }

    async conectarDB() {
        await connectDB();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());

    }

    routes() {
        this.app.use(this.facturaPath, require('../routes/facturaRoutes'));
        this.app.use(this.facturaCompraPath, require('../routes/facturaComRoutes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });

        process.on('SIGINT', async () => {
            try {
                await sql.close();
                console.log('Database connection closed.');
            } catch (err) {
                console.error('Error closing the database connection:', err);
            }
            process.exit();
        });
    }
}

module.exports = Server;