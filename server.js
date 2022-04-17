// require the express package
const express = require('express');
// require the mysql package
const mysql = require('mysql2');

// set an enviornment to use the port neccessary for Heroku
const PORT = process.env.PORT || 3001;
// create an instance of the server and start express with app const
const app = express();

// start listening
app.listen(PORT, ()=> {
    console.log(`API server now on port ${PORT}!`);
})