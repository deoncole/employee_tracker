// require the mysql package
const mysql = require('mysql2');

require('dotenv').config()

// connect to the database
const db = mysql.createConnection(
    {
        host:'localhost',
        user: 'root',
        password: process.env.password,
        database: 'employeesdb'
    },
    console.log('Connected to the employees database')
);

// export the database connection
module.exports = db;