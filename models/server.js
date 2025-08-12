const express = require('express')
const cors = require('cors');
const connectDB = require("../config/db");
const morgan = require('morgan');
const log = require('../logs');

class Server {

    constructor() {
        this.app = express()
        this.puerto = process.env.PORT;
        this.ProductoPatch = '/api/products';
        this.categoriaPatch = '/api/categories';
        this.UsuariosPatch = '/api/auth';

        // ConectarBD
        this.concetarBD();

        // Middlewares
        this.middlewares();

        this.routes();



    }

    middlewares() {

        this.app.use(morgan('dev'));

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

    }


    async concetarBD() {
        await connectDB();
    }



    routes() {

        this.app.use(this.ProductoPatch, require('../routes/product.routes'));
        this.app.use(this.categoriaPatch, require('../routes/category.routes'));
        this.app.use(this.UsuariosPatch, require('../routes/auth.routes'));


    }

    listen() {
        this.app.listen(this.puerto, () => {

            console.log('Servidor corriendo en el puerto', process.env.PORT);
            log(`Servidor corriendo en el puerto ${process.env.PORT}`); // Assuming log is a function to log messages
        })
    }
}

module.exports = Server;