import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

//connect to db
const testdb = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
const maindb = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
//create table
// testdb.run('DROP TABLE IF EXISTS test');
// testdb.run('CREATE TABLE IF NOT EXISTS test(id INTEGER, number INTEGER)');

// testdb.run('INSERT INTO test VALUES (1, 1)');
// testdb.run('SELECT id, number FROM test');

// let sql;
// sql = 'INSERT INTO test VALUES (?, ?)'
// testdb.run(sql, [12345, 67], (err) => {
//     if (err) return console.error(err.message);
// })

