import { Router } from "express";
import {
    getPedidos,
    getPedido,
    createPedido,
    updatePedido,
    deletePedido,
    getPedidosTransito, 
    getPedidosEnviar,
    getLastPedidoId,
    updatePedidosAEnTransito,
    updatePedidoEntregado,
    updateEstadoAListo
} from "../controllers/pedidos.controller.js"; // Asegúrate de que el nombre del archivo sea correcto

const router = Router(); // Creación de una instancia de Router de Express

// Definición de las rutas y los controladores correspondientes
router.get("/pedidos", getPedidos); // Ruta para obtener todos los pedidos
router.get("/pedidos/:id", getPedido); // Ruta para obtener un pedido específico por su ID
router.post("/insertar", createPedido); // Ruta para crear un nuevo pedido
router.put("/actualizar/:id", updatePedido); // Ruta para actualizar un pedido existente por su ID

router.delete("/pedidos/:id", deletePedido); // Ruta para eliminar un pedido existente por su ID

router.get("/pedidostransito", getPedidosTransito); // Ruta para obtener los pedidos en tránsito
router.get("/pedidosenviar/:idempleado", getPedidosEnviar); // Ruta para obtener los pedidos listos para enviar
router.get("/ultimoCodigo", getLastPedidoId);
router.post("/actualizarAEnTransito",updatePedidosAEnTransito);


router.post('/pedidoEntregado', updatePedidoEntregado);

router.put('/actualizarAListo/:id',updateEstadoAListo);

export default router; // Exportación del enrutador configurado


