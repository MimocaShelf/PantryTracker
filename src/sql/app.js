import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

//connect to db
const maindb = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})

export default maindb;

