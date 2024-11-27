import express from 'express';
import pedidosRoutes from './routes/pedidos.router.js'; // Asegúrate de que el nombre del archivo sea correcto

const app = express();

app.use(express.json());

app.use('/pedido', pedidosRoutes); // Agregamos un prefijo '/api' para organizar mejor las rutas

export default app;
