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
    console.log('View all departments: \n');
    // prepared statement to select and view all of the departments from the departments table
    const sql = `SELECT departments.id AS department_id, departments.name AS department_name FROM departments`;
    // query the database and show the results
    db.query(sql, (err, results) => {
        if (err) throw err;

        // display the results from the table
        console.table(results)
        // call the inital user prompt
        promptUser();
    });
};

// method to view all of the roles in the database
const viewRoles = () => {
    console.log('View all of the roles: \n');
    // prepared statement to select and view the roles from the database
    const sql = `SELECT roles.title AS job_title, roles.id, departments.name AS department_name, roles.salary FROM roles,departments WHERE roles.id = departments.id`;
    // query the database and show the results
    db.query(sql, (err, results) => {
        if (err) throw err;

        // display the results from the table
        console.table(results)
        // call the inital user prompt
        promptUser();
    });
};

// method to view all of the employees in the database
const viewEmployees = () => {
    console.log('View all of the employees: \n');
    const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS employee_name, roles.title AS job_title, departments.name AS department, roles.salary, employee.manager_id FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN departments ON employee.roles_id = departments.id`;
    // query the database and show the results
    db.query(sql, (err, results) => {
        if (err) throw err;

        // display the results from the table
        console.table(results)
        // call the inital user prompt
        promptUser();
    });
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