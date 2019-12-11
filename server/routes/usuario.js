const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    // res.json('get usuario local')

    return res.json({
            usuario: req.usuario,
            nombre: req.usuario.nombre,
            email: req.usuario.email
        })
        // { estado:true}

    let desde = req.query.desde || 0; //si viene desde pagina, sino desde 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    //obtener un get de la base de datos, regresa todos los registros de esa colección
    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(desde) //saltarse los primeros 5 registros
        .limit(limite) //regresar 5 registros
        .exec((err, usuarios) => {
            if (err) { //en caso de recibir un error
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        }) //ejecutar ese find
})

//crear registros
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    //obtener toda la información del POST
    let body = req.body;


    //crear nueva instancia del esquema con todas las propiedades, crear un
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    //guardar en la base de datos
    usuario.save((err, usuarioDB) => {
        if (err) { //en caso de recibir un error
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario",
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     })
    // }
})

//put --> sobretodo actualizar, :id especificar parametro a recibir
//actualizar registro, obtener id y actualizar registro que coincida
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body,   { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) { //en caso de recibir un error
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})


app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    //recuperar el id del registro
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) { //en caso de recibir un error
            return res.status(400).json({
                ok: false,
                err
            })
        };
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        //borrar registro fisicamente
        res.json({
            ok: true,
            usuario: usuarioBorrado,
        });
    });
})

module.exports = app;