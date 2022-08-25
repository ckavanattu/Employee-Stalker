const inquirer = require("inquirer");
const conTable = require('console.table');
const db = require('./db/connection')


//prompt user with options
const employeePrompt = () =>{
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Please Make a Selection',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add a Department', 
                'Add a Role', 
                'Add an Employee', 
                'Update an employee role'
            ]
        }

        //Show Tables based on selection
    ]).then((answers) => {     
        const selection = answers.choices;
        
        if (selection === 'View All Departments'){
            console.log('All Departments:');
            department();
            return;
        }
        if (selection === 'View All Roles'){
            roles();
        }
        if (selection === 'View All Employees'){
            employees();
        }
        if (selection === 'Add a Department'){
            addDepartment();
        }
        if (selection === 'Add a Role'){
            addRole();
        }
        if (selection === 'Add an Employee'){
            addEmployee();
        }
        if (selection === 'Update an employee role'){
            updateEmployee();
        }
    })
}

department = () =>{
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        employeePrompt();
    });
};

roles = ()=>{
    const sql = `SELECT role.id, role.title, department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log('SHOWING ROLES:')
        console.table(rows);
        employeePrompt();
    });
};

employees = ()=>{
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
    role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        employeePrompt();
    });
};

addDepartment = () => {

    //ASK what name department they want to add
    inquirer.prompt([
        {
            type: 'input',
            name: 'addingDept',
            message: 'What is the name of the department?',
        }
        //Show update based on input
    ]).then((answers) => {     
        const params = answers.addingDept;
        
        const sql = `INSERT INTO department (name) VALUES (?)`;

        db.query(sql, params, (err, rows) => {
            if (err) throw err;
            console.log(`Added ${params} to the department database`)
            employeePrompt();
        });
    })
    
}

addRole = () => {

    //confirm role
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        } 
    ])
    .then((answers) => {      //
        const roleSQL = `SELECT id, name FROM department`;

        db.query(roleSQL, (err, result) => {
            if (err) throw err;

            //
            const depts = result.map(({ id, name }) => ({ value: id, name: name}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is the role in?',
                    choices: depts
                }
            ]).then(response => {
                const params = [answers.roleTitle, answers.salary, response.dept];

                const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.roleTitle} to roles`);
                    roles();

                    employeePrompt();
                })
            })
        });
    })
}


addEmployee = () => {

    //first name, last name
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        } 
    ])
    .then((answers) => {    
        //show roles
        const roleSQL = `SELECT id, title FROM role`;

        db.query(roleSQL, (err, result) => {
            if (err) throw err;

            //look through roles id/title
            const roles = result.map(({ id, title }) => ({ value: id, name: title}));

            //confirm role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What will the role of the employee be?',
                    choices: roles
                }
            ]).then(response => {
                //prepare Employee list 
                const managerSQL = `SELECT id, first_name, last_name FROM employee`;

                db.query(managerSQL, (err, result) => {
                    if (err) throw err;
        
                    //loop through query
                    const managersList = result.map(({ id, first_name, last_name }) => ({ value: id, name: first_name + " " + last_name}));
        
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the manager of the employee?',
                            choices: managersList
                        }
                    ]).then(managerChoice => {
                        const params = [answers.first_name, answers.last_name, response.role, managerChoice.manager];
        
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUE (?,?,?,?)`

                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("Employee has been added");
                            employees();
                        })
                    })
                })
            })
        });
    })
}

updateEmployee = () =>{
    const employeeSQL = `SELECT id, first_name, last_name FROM employee`;

    db.query(employeeSQL, (err, result) => {
        if (err) throw err;

        const employees = result.map(({ id, first_name, last_name }) => ({ value: id, name: first_name + " " + last_name}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'whichEmployee',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ]).then(employeeResponse => {
            const roleSQL = `SELECT id, title FROM role`;

            db.query(roleSQL, (err, result) => {
                if (err) throw err;
        
                const roles = result.map(({ id, title }) => ({ value: id, name: title}));
        
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'whichRole',
                        message: 'What is the new role for the employee?',
                        choices: roles
                    }
                ]).then(response => {
                    const SQL = `UPDATE employee SET role_id = ? WHERE id = ?`
                    const params = [response.whichRole, employeeResponse.whichEmployee];
    
                    db.query(SQL, params, (err, result) => {
                        if (err) throw err;

                        console.log("Employee role has been updated");

                        employees();
                    })
                    
                })
            })
        })
    })
}



db.connect(err => {
    if (err) throw err;
    employeePrompt();
});
