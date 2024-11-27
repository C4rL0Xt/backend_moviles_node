const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

router.get('/listar',facturaController.getFacturas); 
router.post('/crear',facturaController.postCrearFactura);
router.put('/actualizar',facturaController.putActualizarFactura);
router.get('/lastCode',facturaController.getLastFacturaId);

module.exports = router;
