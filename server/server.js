require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));



//Configuración global de rutas.
app.use(require('./routes/index'));

//conexión con la base de datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})