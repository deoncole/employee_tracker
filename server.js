// require the express package
const express = require('express');
// require the inquirer package
const inquirer = require ('inquirer');
// require the console table package
const cTable = require('console.table');
// // require the database connection
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

// function to validate if the user's salary input is correct
function isDecimal(input){
    var regex = /^\d+\.\d{0,2}$/;
return (regex.test(input));
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
    console.log('\n View all of the employees: \n');
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
    console.log('\n Ready to add a department: \n');

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept_name',
                message: 'Enter the name of the Department: ',
                validate (nameValue){
                    if(!nameValue){
                        return 'Please enter a Department name!'
                    }
                    return true
                }
            }
        ])
        .then ((dept) =>{
            console.log(dept.dept_name);
            const sql = `INSERT INTO departments (name) VALUES ("${dept.dept_name}")`;
            db.query(sql, (err, results)=>{
                if (err) throw err;

                // display the results from the table
                 console.table(results)
                // call the inital user prompt
                promptUser();
            });
        });
};

// method to add a role to the database
const addRole = () => {
    console.log('\n Ready to add a new role: \n');
    // prepared statement to select all of the departments
    const sql = `SELECT * FROM departments`;
    // empty array to hold the departments for the choices prompt
    let deptNames = [];
    //query the database and loop through the data and put them into the array
    db.query(sql, (err, rows)=>{
        if (err) throw err;
        for (let i=0; i<rows.length; i++){
            deptNames.push(rows[i].name);
        }
    });
    // prompt for the new role
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_name',
                message: 'Enter the new role',
                validate (roleName){
                    if(!roleName){
                        return 'Please enter a Role!'
                    }
                    return true
                }
            },
            {
                type: 'input',
                name: 'salary_info',
                message: 'Enter the salary',
                validate (salaryValue){
                    if(!isDecimal(salaryValue)){
                        return 'Please enter a valid Salary, ex.(35000.00)'
                    }
                    return true
                }
            },
            {
                type: 'list',
                name: 'dept_names',
                message: 'Which department does this role belong to?',
                choices: deptNames
            }
        ])
        .then((role)=>{
            const dpSql = `SELECT id FROM departments WHERE name = "${role.dept_names}"`
            // query the database
            db.query(dpSql, (err, row)=>{
                if (err) throw err;
                // const to get the id object into an array of it's own
                let chosenId = row.map(a => a.id);
                // call the funtion to add the role into the database
                roleToDatabase(role.role_name, role.salary_info, chosenId[0])
            });
        });
};

// method to update an employee's role to the database
const updateRole = () => {
    console.log("\n Ready to update the employee's role \n");
    // prepared statement to select all of the roles
    const sql = `SELECT first_name, last_name, roles.title FROM employee, roles WHERE employee.roles_id = roles.id`;
    //query the database
    db.query(sql, (err, rows)=>{
        let eName = [];
        if (err) throw err;
        // set the query to a constant
        const employees = rows;
        // get a new array to be used by concat the employees first and last name for the choices prompt
        const eNameMap = employees.map(a => `${a.first_name} ${a.last_name}`);
        // get a new array of the name of the roles to be used in the choices prompt
        const rTitleMap = employees.map(a => `${a.title}`);
        
        // filter through the array and remove the duplicates to be used for the prompt
        let allRoles = rTitleMap.filter((a,index)=>{
                return rTitleMap.indexOf(a)===index;
            });

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'eNames',
                        message: "Which employee's role do you want to update?",
                        choices: eNameMap
                    },
                    {
                        type: 'list',
                        name: 'rNames',
                        message: "What is the employee's new role?",
                        choices: allRoles
                    }
                ])
                .then((empUpdateAnswers)=>{
                    const empToUpdate = empUpdateAnswers.eNames.split(' ',1);
                    const rSql = `SELECT id FROM roles WHERE title = "${empUpdateAnswers.rNames}"`
                    // query the database
                    db.query(rSql, (err, row)=>{
                        if (err) throw err;
                        // const to get the id object into an array of it's own
                        let roleId = row.map(a => a.id);
                        // call the funtion to update the employee's role into the database
                        updateEmployeesRole(empToUpdate[0],roleId);
                    });
                });
    });
        
};
    
// method to add a employee to the database
const addEmployee = () => {
    console.log('\n ready to add a employee: \n');
    // prepared statement to select all of the roles
    const sql = `SELECT * FROM roles`;
    // empty array to hold the departments for the choices prompt
    let roleNames = [];

    //query the database and loop through the data and put them into the array
    db.query(sql, (err, rows)=>{
        if (err) throw err;
        for (let i=0; i<rows.length; i++){
            roleNames.push(rows[i].title);
        }
    });
    //prompt user to enter new employee information
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'empFirstName',
                message: "Enter the employee's first name: ",
                validate (fstName) {
                    if(!fstName){
                        return "Please enter the employee's first name!"
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'empLastName',
                message: "Enter the employee's last name: ",
                validate (lstName) {
                    if(!lstName){
                        return "Please enter the employee's last name!"
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'role_names',
                message: 'What role will the employee be?',
                choices: roleNames
            },
            {
                type: 'list',
                name: 'mgrID',
                message: 'What manager level will the employee report to?',
                choices: [1,2,3]

            }
        ])
        .then((empAnswers)=>{
            const dpSql = `SELECT id FROM roles WHERE title = "${empAnswers.role_names}"`
            // query the database
            db.query(dpSql, (err, row)=>{
                if (err) throw err;
                // const to get the id object into an array of it's own
                let roleId = row.map(a => a.id);
                // call the funtion to add the employee into the database
                newEmpToDatabase(empAnswers.empFirstName,empAnswers.empLastName,roleId,empAnswers.mgrID);
            });
        });
};

// function to add the new role into the database
const roleToDatabase = (title, salary, id) => {
    const sql = `INSERT INTO roles (title, salary, dept_id) VALUES ("${title}","${salary}","${id}")`
    db.query(sql, (err, results)=>{
        if (err) throw err;
        // display the updated changes to confirm the database has been updated
        console.table(results);
        // prompt the user
        promptUser();
    });
};
// function to add the new employee into the database
const newEmpToDatabase = (fName, lName, rId, mId) => {
    const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ("${fName}","${lName}","${rId}","${mId}")`
    db.query(sql, (err, results)=>{
        // display the updated changes to confirm the database has been updated
        console.table(results);
        // prompt the user
        promptUser();
    });
};

const updateEmployeesRole = (name, roleId) =>{
    const sql = `UPDATE employee SET roles_id = "${roleId}" WHERE first_name = "${name}"`
    db.query(sql, (err, results)=>{
        console.table(results);
        // prompt the user
        promptUser();
    });
};

//connect to the database and start listening
db.connect(err => {
    if (err) throw err;
    app.listen(PORT, ()=> {
    console.log(`API server now on port ${PORT}!`);
   
    // function to start the prompts 
    promptUser();
    });
});