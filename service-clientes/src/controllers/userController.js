const { sql } = require('../database/config');
const { response } = require('express');
const ClienteDto = require('../Dtos/clienteDTO');  
const departamentoController = require('../controllers/departamentoController');

// Listar clientes
const geClientes = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM cliente');
        res.json(result.rows); // PostgreSQL usa `rows` en lugar de `recordset`
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
};

// Listar clientes con el nombre de departamento
const getClientesDto = async (req, res) => {
    try {
        const query = `
            SELECT cliente.id_cliente, cliente.empresa, cliente.representante, 
                   cliente.dni, cliente.email, cliente.telefono, cliente.direccion, 
                   departamentos.nombre_departamento
            FROM cliente
            JOIN departamentos ON cliente.id_departamento = departamentos.id_departamento
        `;
        const result = await sql.query(query);

        const clientesDto = result.rows.map(cliente => 
            new ClienteDto(cliente.id_cliente, cliente.empresa, cliente.representante, cliente.dni,
                cliente.email, cliente.telefono, cliente.direccion, cliente.nombre_departamento)
        );

        res.json(clientesDto);

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
};

// Buscar cliente por id
const getCliente = async (req, res = response) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM cliente WHERE id_cliente = $1';
        const result = await sql.query(query, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
};

// Insertar un cliente
const postInsertarCliente = async (req, res = response) => {
    try {
        const { id_cliente, empresa, representante, dni, email, telefono, direccion, departamento } = req.body;
        const id_departamento = await departamentoController.getDepartamentoPorNombre(departamento);

        const query = `
            INSERT INTO cliente (id_cliente, empresa, representante, dni, email, telefono, direccion, id_departamento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        const params = [id_cliente, empresa, representante, dni, email, telefono, direccion, id_departamento];

        await sql.query(query, params);

        res.json({ message: 'Inserción exitosa' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
};

// Actualizar un cliente
const putActualizarCliente = async (req, res = response) => {
    try {
        const { id_cliente, empresa, representante, dni, email, telefono, direccion, departamento } = req.body;

        let updateFields = [];
        let params = [];
        let index = 1;

        if (empresa) updateFields.push(`empresa = $${index++}`) && params.push(empresa);
        if (representante) updateFields.push(`representante = $${index++}`) && params.push(representante);
        if (dni) updateFields.push(`dni = $${index++}`) && params.push(dni);
        if (email) updateFields.push(`email = $${index++}`) && params.push(email);
        if (telefono) updateFields.push(`telefono = $${index++}`) && params.push(telefono);
        if (direccion) updateFields.push(`direccion = $${index++}`) && params.push(direccion);

        if (departamento) {
            const id_departamento = await departamentoController.getDepartamentoPorNombre(departamento);
            updateFields.push(`id_departamento = $${index++}`);
            params.push(id_departamento);
        }

        params.push(id_cliente);

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }

        const query = `UPDATE cliente SET ${updateFields.join(', ')} WHERE id_cliente = $${index}`;
        const result = await sql.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Actualización exitosa' });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
    }
};

module.exports = {
    geClientes,
    getCliente,
    postInsertarCliente,
    putActualizarCliente,
    getClientesDto
};
