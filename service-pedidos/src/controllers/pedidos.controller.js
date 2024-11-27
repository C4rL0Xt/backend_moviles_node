import { getConnection } from '../database/connection.js'; // Asumiendo que getConnection ahora usa pg
import pkg from 'pg'; // Importar pg para usar Client
const { Client } = pkg;

export const getPedidos = async (req, res) => {
    try {
        const client = await getConnection(); // Obtener conexión
        const result = await client.query('SELECT * FROM pedidos');
        res.json(result.rows); // Usamos 'rows' en lugar de 'recordset' con pg
        client.end(); // Cerrar la conexión después de la consulta
    } catch (error) {
        console.error("Error al obtener pedidos: ", error);
        res.status(500).json({ msg: 'Error al obtener pedidos' });
    }
};

export const getPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getConnection();
        const result = await client.query('SELECT * FROM pedidos WHERE idPedido = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: `Pedido con id ${id} no encontrado` });
        }

        res.json(result.rows[0]); // Acceder al primer resultado
        client.end();
    } catch (error) {
        console.error("Error al obtener el pedido: ", error);
        res.status(500).json({ msg: 'Error al obtener el pedido' });
    }
};

export const createPedido = async (req, res) => {
    try {
        const { idPedido, idCotizacion, idCliente, idMetodoPago, idEstadoEnvio, fechaEntrega, fechaEmision } = req.body;

        if (!idPedido || !idCotizacion || !idCliente || !idMetodoPago || !idEstadoEnvio || !fechaEntrega || !fechaEmision) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        const client = await getConnection();
        await client.query(`
            INSERT INTO pedidos (idPedido, idCotizacion, idCliente, idMetodoPago, idEstadoEnvio, fechaEntrega, fechaEmision)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [idPedido, idCotizacion, idCliente, idMetodoPago, idEstadoEnvio, fechaEntrega, fechaEmision]
        );

        res.status(201).json({ msg: 'Pedido creado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al crear el pedido: ", error);
        res.status(500).json({ msg: 'Error al crear el pedido' });
    }
};

export const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { idCotizacion, idCliente, idMetodoPago, idEstadoEnvio, fechaEntrega, fechaEmision } = req.body;

        const client = await getConnection();

        let query = 'UPDATE pedidos SET idMetodoPago = $1, idEstadoEnvio = $2';
        const values = [idMetodoPago, idEstadoEnvio];

        if (idEmpleado) {
            query += ', idEmpleado = $3';
            values.push(idEmpleado);
        }

        query += ' WHERE idPedido = $4';
        values.push(id);

        await client.query(query, values);

        res.json({ msg: 'Pedido actualizado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al actualizar el pedido: ", error);
        res.status(500).json({ msg: 'Error al actualizar el pedido' });
    }
};

export const updateEstadoAListo = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await getConnection();
        await client.query('UPDATE pedidos SET idEstadoEnvio = 4 WHERE idPedido = $1', [id]);

        res.json({ msg: 'Estado de envío del pedido actualizado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al actualizar el pedido: ", error);
        res.status(500).json({ msg: 'Error al actualizar el estado de envío del pedido' });
    }
};

export const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await getConnection();
        await client.query('DELETE FROM pedidos WHERE idPedido = $1', [id]);

        res.json({ msg: 'Pedido eliminado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al eliminar el pedido: ", error);
        res.status(500).json({ msg: 'Error al eliminar el pedido' });
    }
};

export const getPedidosTransito = async (req, res) => {
    try {
        const client = await getConnection();
        const result = await client.query('SELECT * FROM pedidos WHERE idEstadoEnvio = 2');
        res.json(result.rows);
        client.end();
    } catch (error) {
        console.error("Error al obtener pedidos en tránsito: ", error);
        res.status(500).json({ msg: 'Error al obtener pedidos en tránsito' });
    }
};

export const getPedidosEnviar = async (req, res) => {
    try {
        const { idempleado } = req.params;
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; 

        const client = await getConnection();
        const result = await client.query(`
            SELECT * FROM pedidos 
            WHERE idEstadoEnvio IN (2, 4) 
            AND CONVERT(DATE, fechaentrega) = $1
            AND idEmpleado = $2`, [todayString, idempleado]);

        res.json(result.rows);
        client.end();
    } catch (error) {
        console.error("Error al obtener pedidos listos para enviar: ", error);
        res.status(500).json({ msg: 'Error al obtener pedidos listos para enviar' });
    }
};

export const getLastPedidoId = async (req, res) => {
    try {
        const client = await getConnection();
        const result = await client.query('SELECT idpedido FROM pedidos ORDER BY idpedido DESC LIMIT 1');

        if (result.rows.length === 0) {
            console.error("No hay pedidos registrados", result);
            return res.status(404).json({ msg: 'No hay pedidos registrados' });
        }

        res.json({ id: result.rows.idpedido });
        console.log(result.rows);
        client.end();
    } catch (error) {
        console.error("Error al obtener el último ID de pedido: ", error);
        res.status(500).json({ msg: 'Error al obtener el último ID de pedido' });
    }
};

export const updatePedidosAEnTransito = async (req, res) => {
    try {
        const { pedidos, idEmpleado } = req.body;
        const client = await getConnection();

        for (const pedido of pedidos) {
            await client.query('UPDATE pedidos SET idEstadoEnvio = 2 WHERE idPedido = $1', [pedido.idPedido]);
        }

        await client.query('UPDATE transportistas SET estado = $1 WHERE idEmpleado = $2', ['activo', idEmpleado]);

        res.json({ msg: 'Pedidos actualizados a En tránsito y estado de empleado actualizado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al actualizar pedidos a En tránsito y estado de empleado: ", error);
        res.status(500).json({ msg: 'Error al actualizar pedidos a En tránsito y estado de empleado' });
    }
};

export const updatePedidoEntregado = async (req, res) => {
    try {
        const { pedidos, idpedido, idEmpleado } = req.body;
        const client = await getConnection();

        // Actualiza el estado del pedido específico
        await client.query('UPDATE pedidos SET idEstadoEnvio = 3 WHERE idPedido = $1', [idpedido]);

        // Verifica cuántos pedidos quedan en el arreglo pedidos
        const remainingPedidos = pedidos.filter(pedido => pedido.idPedido !== idpedido);

        // Si solo queda un pedido, actualiza el estado del transportista
        if (remainingPedidos.length === 0) {
            await client.query('UPDATE transportistas SET estado = $1 WHERE idEmpleado = $2', ['inactivo', idEmpleado]);
        }

        res.json({ msg: 'Pedido actualizado a Entregado y estado de empleado actualizado exitosamente' });
        client.end();
    } catch (error) {
        console.error("Error al actualizar pedido a Entregado y estado de empleado: ", error);
        res.status(500).json({ msg: 'Error al actualizar pedido a Entregado y estado de empleado' });
    }
};
