const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
        // res.json({
        //     usuario: googleUser
        // })

    Usuario.findOne({ email: googleUser.end }, (err, usuarioDB) => {
        if (err) { //en caso de recibir un error
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) { //si el usuario ya existe en la base de datos
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                })
            } else {
                let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expira en 30 dias


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else { //si el usuario no existe en nuestra base de datos, nuevo usuario

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) { //en caso de recibir un error
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({ //recibir el token
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expira en 30 dias

                //devolver el objeto del nuevo usuario
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            });
        }

    });

});
module.exports = app;