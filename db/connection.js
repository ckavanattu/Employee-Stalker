const mysql = require('mysql2');
const db = mysql.createConnection(
    {
        host: 'localhost', 
        user: 'root',

        
        password: 'CK4264@9413#(^*',
        database: 'employees'
    }
);

module.exports = db;