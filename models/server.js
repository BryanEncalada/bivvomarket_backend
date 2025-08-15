const express = require('express')
const cors = require('cors');
const { connectDB } = require("../config/db");
const morgan = require('morgan');
const log = require('../logs');

const { productoSchema } = require("../models/Product");
const { ProductoImagenSchema } = require("../models/productoImagen");
const { ProductoDetalleListaChema } = require("../models/productoDetalleLista");
const { ProductoTallaChema } = require("../models/productoTalla");

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
        // Lista de orígenes permitidos
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

    }


    async concetarBD() {
        await connectDB();


        productoSchema.hasMany(ProductoImagenSchema, { foreignKey: 'producto_id', as: 'imagenes' });
        ProductoImagenSchema.belongsTo(productoSchema, { foreignKey: 'producto_id', as: 'producto' });

        productoSchema.hasMany(ProductoTallaChema, { foreignKey: 'producto_id', as: 'tallas' });
        ProductoTallaChema.belongsTo(productoSchema, { foreignKey: 'producto_id', as: 'producto' });

        productoSchema.hasMany(ProductoDetalleListaChema, { foreignKey: 'producto_id', as: 'detallesLista' });
        ProductoDetalleListaChema.belongsTo(productoSchema, { foreignKey: 'producto_id', as: 'producto' });

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