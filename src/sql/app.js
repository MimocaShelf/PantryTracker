import {createRequire} from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

import path from 'path';
import { fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'main.db');

//connect to db
const maindb = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to SQL Database at:', dbPath);
    }
})

export default maindb;

