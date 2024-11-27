const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

router.get('/listar',departamentoController.geDepartamentos);
router.get('/buscar/:nombre',departamentoController.getDepartamentoPorNombre);

module.exports = router;