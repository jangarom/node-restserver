//crear constantes y variables de forma global

// ====================
// Puerto
// ====================
process.env.PORT = process.env.PORT || 3000;


// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Vencimiento del Token
// ====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ====================
// SEED de autenticación
// ====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ====================
// Base de datos
// ====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb+srv://jangarom:1g36zvbdzXrwLhn2@jangaromcluster-lwngl.mongodb.net/cafe?retryWrites=true&w=majority';
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ====================
// Google client ID
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '691073670166-4m63mbp0ndv1ohms1uh3c0jbj3bsvmgg.apps.googleusercontent.com';