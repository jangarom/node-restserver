const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//=========================
//Mostrar todas las categorias
//=========================

app.get('/categoria', (req, res) => {



});

//=====================================
//Mostrar todas las categorias por ID 
//=====================================

app.get('/categoria/:id', (req, res) => {
    // Categoria.findById()

    let id = req.param.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) { //en caso de recibir un error
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) { //en caso de recibir un error
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })



});


//=====================================
// Crear nueva categoria
//=====================================

app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) { //en caso de recibir un error
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) { //en caso de recibir un error
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


});


//=====================================
// actualizar categoria
//=====================================

app.put('/categoria', (req, res) => {

});

//=====================================
// Eliminar categoria
//=====================================

app.delete('/categoria', (req, res) => {
    //solo un administrador puede borrar categorias.
    //categoria.findByIdAndRemove
});



module.exports = app;