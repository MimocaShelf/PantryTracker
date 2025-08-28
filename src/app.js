import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
let sql;

//connect to db
const testdb = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
const maindb = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
//create table
// maindb.run('DROP TABLE IF EXISTS test');
// testdb.run('DROP TABLE IF EXISTS test');
// sql = 'CREATE TABLE test(id INTEGER PRIMARY KEY AUTOINCREMENT)';
// testdb.run(sql);
// maindb.run(sql);

//drop table
// testdb.run('SELECT id FROM test');