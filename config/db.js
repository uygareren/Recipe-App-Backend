const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'recipe_app',
    password: '123456'
});

module.exports = connection;
