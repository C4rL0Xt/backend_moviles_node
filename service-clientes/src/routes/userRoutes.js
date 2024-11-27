
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/listar', userController.geClientes);  
router.get('/listardto', userController.getClientesDto);
router.put('/actualizar', userController.putActualizarCliente);  // Actualizar cliente
router.post('/insertar', userController.postInsertarCliente);   // Insertar cliente
router.get('/:id', userController.getCliente);  

module.exports = router;