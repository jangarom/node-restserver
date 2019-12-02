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