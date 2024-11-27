class ClienteDto {
    constructor(id_cliente, empresa, representante, dni, email, telefono, direccion, nombre_departamento) {
        this.id_cliente = id_cliente;
        this.empresa = empresa;
        this.representante = representante;
        this.dni = dni;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.nombre_departamento = nombre_departamento;
    }
}

module.exports = ClienteDto;