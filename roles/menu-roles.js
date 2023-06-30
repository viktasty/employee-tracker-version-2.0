const inquirer = require('inquirer');
const connection = require('../config/connection');
const viewRoles = require('./view-roles')
const addRole = require('./add-role');
const deleteRole = require('./del-role')
const editRole = require('./edit-role')
const mainMenu = require('../main-menu')

class Role {
    constructor() {
        this.departments = [];
        this.roles = [];
    };


    menu() {
        try {
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Employee Roles Menu',
                        name: 'menuChoice',
                        choices: ['View Roles', 'Add Role', 'Edit Role', 'Delete Role', 'Exit']
                    }
                ])
                .then(({ menuChoice }) => {
                    try {
                        switch (menuChoice) {
                            case 'View Roles':
                                console.log('You have chosen to view roles');
                                // viewRoles();
                                this.view();
                                break;
                            case 'Add Role':
                                console.log('You have chosen to add a role');
                                // addRole();
                                this.getDepartments();
                                this.add();
                                break;
                            case 'Edit Role':
                                console.log('You have chosen to edit role');
                                // editRole();
                                this.getRoles();
                                this.edit();
                                break;
                            case 'Delete Role':
                                console.log('You have chosen to delete a role');
                                // deleteRole();
                                this.getRoles();
                                this.delete();
                                break;
                            case 'Exit':
                                console.log('Goodbye! Type node server to pull up main menu!');
                                connection.end();
                                break;
                        }
                    } catch (err) {
                        console.log(err);
                    };
                });
        } catch (err) {
            console.log(err);
        };
    };

    getDepartments() {
        try {
            const query = 'SELECT * FROM department';
            connection.query(query, (err, res) => {
                try {
                    this.departments.splice(0, this.departments.length); // empty the array
                    res.forEach(({ department_name }) => {
                        this.departments.push(department_name);
                    })
                } catch (err) {
                    console.log(err);
                };
            });
        } catch (err) {
            console.log(err);
        };
    };

    getRoles() {
        try {
            const query = 'SELECT * FROM role';
            connection.query(query, (err, res) => {
                try {
                    this.roles.splice(0, this.roles.length);
                    res.forEach(({ title }) => {
                        this.roles.push(title);
                    });

                } catch (err) {
                    console.log(err);
                };
            });
        } catch (err) {
            console.log(err);
        };
    };

    view() {
        try {
            connection.query('SELECT * FROM role', (err, res) => {
                try {
                    res.forEach(({ role_id, title, salary, department_id }) => {
                        console.log(`Role ID : ${role_id} | Title : ${title} | Salary : ${salary} | Department ID : ${department_id}`);
                    });
                    console.log('-----------------------------------');
                    this.menu();
                } catch (err) {
                    console.log(err);
                };
            });

        } catch (err) {
            console.log(err);
        };
    };

    add() {
        try {
            try {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            message: 'Please enter a Role Title',
                            name: 'title',
                            validate: checkInput => checkInput ? true : (console.log('Please enter a role title'), false)
                        },
                        {
                            type: 'number',
                            message: 'Enter Salary',
                            name: 'salary',
                            validate: checkInput => checkInput ? true : (console.log('Please enter a valid role title!'), false)
                        },
                        {
                            type: 'list',
                            message: 'Please choose a department',
                            name: 'department',
                            choices: this.departments
                        }
                    ])
                    .then(({ title, salary, department }) => {
                        try {
                            console.log('Inserting a new role...\n');
                            const query = 'INSERT INTO role SET ?';
                            connection.query(query,
                                {
                                    title: `${title}`,
                                    salary: `${salary}`,
                                    department_id: `${department}`
                                },
                                (err, res) => {
                                    try {
                                        console.log(`${res.affectedRows} new role!\n`);
                                        inquirer
                                            .prompt([
                                                {
                                                    type: 'confirm',
                                                    message: 'Would you like to add another role?',
                                                    name: 'add'
                                                }
                                            ])
                                            .then(({ add }) => {
                                                if (!add) {
                                                    this.menu();
                                                } else if (add) {
                                                    addRole();
                                                };
                                            });
                                    } catch (err) {
                                        console.log(err);
                                    };
                                });
                        } catch (err) {
                            console.log(err);
                        };
                    });
            } catch (err) {
                console.log(err);
            };
        } catch (err) {
            console.log(err);
        };
    };

    edit() {
        try {
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Are you sure you want to edit a role?',
                        name: 'edit'
                    },
                    {
                        type: 'list',
                        message: 'Please enter a Role you would like to edit',
                        name: 'oldTitle',
                        choices: this.roles,
                        validate: checkInput => checkInput ? true : (console.log('Please enter a role name!'), false)
                    },
                    {
                        type: 'input',
                        message: 'Enter new role title',
                        name: 'newTitle',
                        validate: checkInput => checkInput ? true : (console.log('Please enter a department name!'), false)
                    },
                    {
                        type: 'number',
                        message: 'Enter new salary',
                        name: 'newSal',
                        validate: checkInput => checkInput ? true : (console.log('Please enter a role salary!'), false)
                    }
                ])
                .then(({ oldTitle, newTitle, newSal }) => {
                    try {
                        console.log('Updating Role Name...\n');
                        const query = 'UPDATE role SET ? WHERE ?';
                        connection.query(query,
                            [
                                {
                                    title: `${newTitle}`,
                                    salary: `${newSal}`
                                },
                                {
                                    title: `${oldTitle}`
                                }
                            ],
                            (err, res) => {
                                try {
                                    console.log(`${res.affectedRows} roles updated!\n`);
                                    this.menu();
                                } catch (err) {
                                    console.log(err);
                                };
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    };
                });
        } catch (err) {
            console.log(err);
        };
    };


    delete() {
        try {
            inquirer
                .prompt([
                    {
                        type: 'confirm',
                        message: 'Are you sure you want to remove role?',
                        name: 'delete'
                    },
                    {
                        type: 'list',
                        message: 'Please choose a role to delete',
                        name: 'role',
                        choices: this.roles
                    }
                ])
                .then(({ role }) => {
                    try {
                        //need to add validation that role exists
                        console.log('Deleting role...\n');
                        const query = 'DELETE FROM role WHERE ?';
                        connection.query(query,
                            {
                                title: `${role}`,
                            },
                            (err, res) => {
                                console.log(res)
                                if(err) console.log(err);
                                try {
                                    console.log(`${res.affectedRows} roles deleted!\n`);
                                    this.menu();
                                } catch (err) {
                                    console.log(err);
                                };
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    };
                });
        } catch (err) {
            console.log(err);
        };

    };
};

const rolesMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Employee Roles Menu',
                name: 'menuChoice',
                choices: ['View Roles', 'Add Role', 'Edit Role', 'Delete Role', 'Exit']
            }
        ])
        .then(({ menuChoice }) => {
            try {
                switch (menuChoice) {
                    case 'View Roles':
                        console.log('You have chosen to view roles');
                        viewRoles();
                        break;
                    case 'Add Role':
                        console.log('You have chosen to add a role');
                        addRole();
                        break;
                    case 'Edit Role':
                        console.log('You have chosen to edit role');
                        editRole();
                        break;
                    case 'Delete Role':
                        console.log('You have chosen to delete a role');
                        deleteRole();
                        break;
                    case 'Exit':
                        console.log('Goodbye! Type node server to pull up main menu!');
                        connection.end();
                        break;
                }
            } catch (err) {
                console.log(err);
            };
        });

};

module.exports = Role;