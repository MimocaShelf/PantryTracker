import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();
let sql;

//connect to db
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
//create table
sql = 'CREATE TABLE test(id INTEGER PRIMARY KEY AUTOINCREMENT)';
db.run(sql);

//drop table