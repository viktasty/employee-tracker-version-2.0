// require('iconv-lite').encodingExists('foo')
const connection = require('../config/connection')
const mysql = require('mysql2');
require('dotenv').config()


const Main = require('../models/Main');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));



afterEach(() => {
    console.log("closing database connection");
    connection.end();
})
describe("Testing Main model build", () => {
    
    // surely there is a better way to do this, but solves this error for now
    /* ReferenceError: You are trying to `import` a file after the Jest environment has been torn down. From __tests__/Main.test.js. */
    afterEach(async () => {
        await sleep(2000);
    })
    test("Can instantiate Main model instance", async () => {
            const model = await new Main();
            expect(typeof(model)).toBe("object");
    });


})

connection.query = jest.fn().mockImplementation((query, callback) => {
    callback(null, [
        {roleId: 1, title: 'Role 1'},
        {roleId: 2, title: 'Role 2'}
    ])
})

describe("testing getRoles() method", () => {
    test("expect the roleId and roleName to be arrays", async () => {
        const model = await new Main();
        await model.getRoles();

        expect(Array.isArray(model.roleId)).toBe(true);
        expect(Array.isArray(model.roleName)).toBe(true);
        
    })
})