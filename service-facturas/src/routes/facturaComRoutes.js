const express = require('express');
const router = express.Router();
const facturaCompraController = require('../controllers/facturaCompraController');

router.get('/listar',facturaCompraController.getFacturasCompra);
router.post('/crear',facturaCompraController.postCrearFacturaCompra);

module.exports = router;


