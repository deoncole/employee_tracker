// require the express package
const express = require('express');
// require the inquirer package
const inquirer = require ('inquirer');
// require the console table package
const cTable = require('console.table');
// require the database connection
const db = require('./db/connection');

// set an enviornment to use the port neccessary for Heroku
const PORT = process.env.PORT || 3001;
// create an instance of the server and start express with app const
const app = express();

// add the express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// array for the choices to be used in the prompt
const menuOptions = ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'];

// function to hold a switch statement that takes in the user's choice and passes it through to activate the function from their choice
function userChoice (choice){
    switch(choice){
        case 'View all departments':
            viewDepartments()
            break;
        case 'View all roles':
            viewRoles()
            break;
        case 'View all employees':
            viewEmployees()
            break;
        case 'Add a department':
            addDepartment()
            break;
        case 'Add a role':
            addRole()
            break;
        case 'Add an employee':
            addEmployee()
            break;
        default: 
            updateRole()
            break;
    }
};

// inquirer prompts for the user to get started
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: menuOptions,
        }
    ])
    .then((choice) =>{
        userChoice(choice.menu);
    });
} 

// method to view all of the departments in the database
const viewDepartments = () => {
    console.log('ready to view departments');

};

// method to view all of the roles in the database
const viewRoles = () => {
    console.log('ready to view roles');
};

// method to view all of the employees in the database
const viewEmployees = () => {
    console.log('ready to view employees');
};

// method to add a department to the database
const addDepartment = () => {
    console.log('ready to add a department');
};

// method to add a role to the database
const addRole = () => {
    console.log('ready to add a role');
};

// method to update an employee's role to the database
const updateRole = () => {
    console.log('ready to update the employees role');
};

// method to add a employee to the database
const addEmployee = () => {
    console.log('ready to add a employee');
};

//connect to the database and start listening
db.connect(err => {
    if (err) throw err;
    app.listen(PORT, ()=> {
    console.log(`API server now on port ${PORT}!`);
   
    // function to start the prompts 
    promptUser();
    });
})