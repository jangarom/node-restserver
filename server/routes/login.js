const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    //si existe un correo valido
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) { //en caso de recibir un error
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //si el usuario no fue encontrado
        if (!usuarioDB) {

            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }


        let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expira en 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

    // res.json({
    //     ok: true,
    // })
});


module.exports = app;