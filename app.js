const Server = require('./models/server');
require('dotenv').config();

const serve = new Server();
serve.listen();