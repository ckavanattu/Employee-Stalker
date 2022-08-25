const mysql = require('mysql2');
const inquirer = require("inquirer");
const conTable = require('console.table');
const db = require('./db/connection')
//require('dotenv').config();





db.connect(err => {
    if (err) throw err;
    employeePrompt();
});
