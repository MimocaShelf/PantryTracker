import express from 'express'
import {readPantryItems, readSpecificPantryItems} from './crud.js'
const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    console.log('root route hit');
    res.send('server is definitely running');
});

app.get('/getAllItems', (req, res) => {
    console.log('test');
    readPantryItems((err, rows) => {
        if(err){
            res.status(500).send(err.message)
        } else {
            res.status(200).json(rows)
            console.log(rows)
        }
    })
})

app.get('/getSpecificItems', (req, res) => {
    const {name} = req.query;
    console.log('test');

    if(!name) {
        return res.status(400).send('Missing "name" query parameter');
    }

    readSpecificPantryItems(name, (err, rows) => {
        if(err){
            res.status(500).send(err.message)
        } else {
            res.status(200).json(rows)
        }
    })
})

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001/")
})