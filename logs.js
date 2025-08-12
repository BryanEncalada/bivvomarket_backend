const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'app.log');

function escribirLog(mensaje) {
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${mensaje}\n`);
}

module.exports = escribirLog;