const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//obtener cascaron para tener el esquema de mongoose
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

//definir nuestro esquema ahora, declaración. definir campos de la coleccion usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    img: {
        type: String,
        required: false
    }, //no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //default: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, //boolean
    google: {
        type: Boolean,
        default: false
    }, //boolean
});

//modificar esquema del json a la hora de dovolver la pass
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);