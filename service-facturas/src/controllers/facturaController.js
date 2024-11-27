const {sql}= require('../database/config');
const { response, request } = require('express');
const moment = require('moment');

// Listar facturas
const getFacturas = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM facturas_venta');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
}

//Creacion de factura
const postCrearFactura = async (req, res = response) => {
    try {
        const { idFactura, idPedido, idEstadoPago, fechaLimite, fechaPago } = req.body;

        const fechaLimiteFormatted = moment(fechaLimite).format('YYYY-MM-DD');
        console.log("Estos son los datos pe: ",fechaLimite,fechaLimiteFormatted);
        const result = await sql.query`
        INSERT INTO facturas_venta (idFactura, idPedido, idEstadoPago, fechaLimite)
        VALUES (${idFactura}, ${idPedido}, ${idEstadoPago}, ${fechaLimiteFormatted})
        `;

        res.json({ message: 'Creación de factura exitosa', result: result.recordset });
        console.log("Inserción de factura");
    } catch (err) {
        console.log("Error: no se pudo insertar");
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
};


//Actualizacion de factura
const putActualizarFactura = async (req, res = response) => {
    try {
        const { idFactura, idPedido, idEstadoPago, fechaLimite, fechaPago } = req.body;

        const fechaLimiteFormatted = fechaLimite ? moment(fechaLimite).format('YYYY-MM-DD') : null;
        const fechaPagoFormatted = fechaPago ? moment(fechaPago).format('YYYY-MM-DD') : null;

        let updateFields = [];
        if (idPedido) updateFields.push(`idPedido = '${idPedido}'`);
        if (idEstadoPago) {
            updateFields.push(`idEstadoPago = '${idEstadoPago}'`);
            // Check if the payment status is set to "Pagado" (assuming 2 is the id for "Pagado")
            if (idEstadoPago === 2) {
                const currentDate = moment().format('YYYY-MM-DD');
                updateFields.push(`fechaPago = '${currentDate}'`);
            }
        }
        if (fechaLimite) updateFields.push(`fechaLimite = '${fechaLimiteFormatted}'`);
        if (fechaPago && idEstadoPago !== 2) updateFields.push(`fechaPago = '${fechaPagoFormatted}'`);

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }

        const query = `
            UPDATE facturas_venta 
            SET ${updateFields.join(', ')} 
            WHERE idFactura = '${idFactura}'
        `;

        const result = await sql.query(query);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        
        res.json({ message: 'Actualización de factura exitosa', result: result.recordset });
        console.log("Actualización de factura");
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
    }
};

//Obtener el ultimo codigo de factura creado
const getLastFacturaId = async (req, res = response) => {
    try {
        const result = await sql.query('SELECT TOP 1 idFactura FROM facturas_venta ORDER BY idFactura DESC');
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'No hay facturas registradas' });
        }
        res.json({ id: result.recordset[0].idFactura });
    } catch (error) {
        console.error('Error al obtener el último ID de factura: ', error);
        res.status(500).json({ msg: 'Error al obtener el último ID de factura' });
    }
};

module.exports = {
    getFacturas,
    postCrearFactura,
    putActualizarFactura,
    getLastFacturaId
    
}
