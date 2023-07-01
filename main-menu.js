const inquirer = require('inquirer');
const connection = require('./config/connection');
const Employee = require('./employees/menu-emp');
const Department = require('./departments/menu-dept');
const Role = require('./roles/menu-roles');

const empMenuChoices = ['View Employees', 'Add Employee', 'Edit Employee', 'Delete Employee', 'Exit'];

// const empMenuFunctions = [viewEmployees(), addEmployee(), editEmployee(), deleteEmployee()]
const employee = new Employee();
const department = new Department();
const role = new Role();
const mainMenu = async () => {
    try {
        const { menu } = await inquirer.prompt([
            {
                type: 'list',
                message: 'Main Menu',
                name: 'menu',
                choices: ['Departments', 'Employee Roles', 'Employees', 'Exit']
            }
        ]);

        switch (menu) {
            case 'Departments':
                console.log('You choose departments');
                department.menu();
                break;
            case 'Employee Roles':
                console.log('You choose employee roles');
                role.menu();
                break;
            case 'Employees':
                console.log('You have chosen Employees');
                employee.menu();
                break;
            case 'Exit':
                console.log('Goodbye! Type node server to restart the Employee Management System!');
                connection.end();
                break;
        }
    } catch (err) {
        console.log(err);
    };
};

module.exports = mainMenu;