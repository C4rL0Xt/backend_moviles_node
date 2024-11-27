const {sql}= require('../database/config');
const moment = require('moment');
// Listar facturas de compra
const getFacturasCompra = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM facturas_compra');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
}

const postCrearFacturaCompra = async (req, res = response) => {
    try {
        const { idFactura, idOrdenCompra, fecha_limite, fecha_pago } = req.body;

        const fechaLimiteFormatted = moment(fecha_limite, ['DD/MM/YYYY']).format('YYYY-MM-DD');
        const fechaPagoFormatted = moment(fecha_pago, ['DD/MM/YYYY']).format('YYYY-MM-DD');

        const result = await sql.query`
        INSERT INTO facturas_compra (idFactura, idOrdenCompra, fecha_limite, fecha_pago)
        VALUES (${idFactura}, ${idOrdenCompra}, ${fechaLimiteFormatted}, ${fechaPagoFormatted})
        `;

        res.json({ message: 'Creación de factura exitosa', result: result.recordset });
        console.log("Inserción de factura");
    } catch (err) {
        console.log("Error: no se pudo insertar");
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
};

module.exports = {
    getFacturasCompra,
    postCrearFacturaCompra
    
}
