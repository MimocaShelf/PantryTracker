import express from 'express'
import cors from 'cors'
import {readPantryItems, readSpecificPantryItems, insertPantryItemToMealPrep, readBreakfastIngredients, readLunchIngredients, readDinnerIngredients, deleteMealPrepItem} from './crud.js'
const app = express();

app.use(cors({origin: 'http://localhost:5173'}))
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
        }
    })
})

app.get('/getAllItemsAndNutritionValues', async (req, res) => {
    try{
        readPantryItems(async (err, items) => {
            if(err){
                return res.status(500).send('Error getting pantry items record from database')
            }

            let nutritionValues = []
            const queryString = items.map(item => item.item_name).join(' ');
            const encodedQuery = encodeURIComponent(queryString);

                try {
                    const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodedQuery}`, {
                        headers: {
                            'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'
                        }
                    });

                    const data = await response.json();
                    nutritionValues = data.items.map(entry => ({
                        itemName: entry.name,
                        calories: entry.calories,
                        protein: entry.protein_g,
                        carbohydrate: entry.carbohydrates_total_g,
                        fats: entry.fat_total_g
                    }))

                    res.status(200).json(nutritionValues);
                    //nutritionValues.push({itemName: item.item_name, calories: data.items[1], protein: data.items[5], carbohydrate: data.items[9], fats: data.items[3]})
                } catch (apiError) {
                    console.log(apiError.message);
                }
            
        })
    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }
})

app.post('/submitUserInput', (req, res) => {
    const userInput = req.body.input;
    console.log('Received front frontend', userInput);

    try {
        readSpecificPantryItems(userInput, async (err, rows) => {
            if(err){
                res.status(500).send(err.message)
            }            

            console.log(rows);
            let nutritionValues = []
            const queryString = rows.map(row => row.item_name).join(' ');
            const encodedQuery = encodeURIComponent(queryString);

                try {
                    const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodedQuery}`, {
                        headers: {
                            'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'
                        }
                    });

                    const data = await response.json();
                    nutritionValues = data.items.map(entry => ({
                        itemName: entry.name,
                        calories: entry.calories,
                        protein: entry.protein_g,
                        carbohydrate: entry.carbohydrates_total_g,
                        fats: entry.fat_total_g
                    }))

                    res.status(200).json(nutritionValues);
                    //nutritionValues.push({itemName: item.item_name, calories: data.items[1], protein: data.items[5], carbohydrate: data.items[9], fats: data.items[3]})
                } catch (apiError) {
                    console.log(apiError.message);
                }

        })


    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }


})

app.post('/addToMealPrep', (req, res) => {
    const itemName = req.body.itemName;
    const time = req.body.time;
    console.log('Received front frontend', itemName, ' ', time);

    try {
        readSpecificPantryItems(itemName, async (err, rows) => {
            if(err){
                res.status(500).send(err.message)
            }  

            const itemId = rows[0].pantry_id

            const mealTimeMap = {Breakfast: 1, Lunch: 2, Dinner: 3}
            const mealSlotId = mealTimeMap[time]

            insertPantryItemToMealPrep(mealSlotId, itemId, async (err) => {
                if(err){
                    res.status(500).send(err.message)
                }   
                res.send({success: true, itemId, mealSlotId})
            })
        })

    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }
})

async function getNutritionItems(rows) {
     const queryString = rows.map(row => row.item_name).join(' ');
     const encodedQuery = encodeURIComponent(queryString);
                try {
                    const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodedQuery}`, {
                        headers: {
                            'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'
                        }
                    });

                    const data = await response.json();
                    return data.items.map(entry => ({
                        itemName: entry.name,
                        calories: entry.calories,
                        protein: entry.protein_g,
                        carbohydrate: entry.carbohydrates_total_g,
                        fats: entry.fat_total_g
                    }))

                } catch (outerError){
                    res.status(500).send('Unexpected Error');
                }
}

app.get('/getMealPrep', (req, res) => {
    try{
        readBreakfastIngredients(async (err, breakfastRows) => {
            if(err){ res.status(500).send(err.message) }  

            readLunchIngredients(async (err, lunchRows) => {
                if(err){ res.status(500).send(err.message) }  

                readDinnerIngredients(async (err, dinnerRows) => {
                    if(err){ res.status(500).send(err.message) }  

                    const breakfastItems = await getNutritionItems(breakfastRows);
                    const lunchItems = await getNutritionItems(lunchRows);
                    const dinnerItems = await getNutritionItems(dinnerRows);

                    res.send({
                        breakfastItems : breakfastItems,
                        lunchItems: lunchItems,
                        dinnerItems: dinnerItems
                    })
                })
            })
        })

    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }
})

async function getRecipe(rows) {
    
     const queryString = rows.map(row => row.item_name).join(' ');
     const encodedQuery = encodeURIComponent(queryString);
     console.log(queryString);
                try {
                    const response = await fetch(`https://api.api-ninjas.com/v1/recipe?query=${encodedQuery}`, {
                        headers: {
                            'X-Api-Key': '56pVmwMXIBB6/OsFU9yBjw==2WphEiN4FEbAQk6E'
                        }
                    });

                    if(!response.ok){
                        const errorText = await response.text();
                        console.log('inside', errorText);
                        throw new Error('API failed');
                    }

                    const data = await response.json();
                    console.log(data);
                    
                    return data.map(entry => ({
                        title: entry.title,
                        ingredients: entry.ingredients,
                        servings: entry.servings,
                        instructions: entry.instructions,
                    }))

                } catch (outerError){
                    console.error('Fetch Failed', outerError)
                }
}

app.get('/getRecipe', (req, res) => {
     try{
        readBreakfastIngredients(async (err, breakfastRows) => {
            if(err){ res.status(500).send(err.message) }  

            readLunchIngredients(async (err, lunchRows) => {
                if(err){ res.status(500).send(err.message) }  

                readDinnerIngredients(async (err, dinnerRows) => {
                    if(err){ res.status(500).send(err.message) }  

                    const breakfastRecipe = await getRecipe(breakfastRows);
                    const lunchRecipe = await getRecipe(lunchRows);
                    const dinnerRecipe = await getRecipe(dinnerRows);

                    res.send({
                        breakfastRecipe : breakfastRecipe,
                        lunchRecipe: lunchRecipe,
                        dinnerRecipe: dinnerRecipe
                    })
                })
            })
        })
    } catch (outerError){
        
    }
}) 


app.post('/removeMealPrepItem', (req, res) => {
    const itemName = req.body.itemName;
    const time = req.body.time;

    readSpecificPantryItems(itemName, (err, rows) => {
            
            if(err){
                res.status(500).send(err.message)
            }        
            
            deleteMealPrepItem(rows[0].pantry_item_id, time, err => {
                if(err){ 
                    res.status(500).send(err.message) 
                } else {
                    res.send({success: true, message: 'Item removed'})
                }
            })  
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

app.get('/api/test', (req, res) => {
    res.json({message: 'testing'})
})

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001/")
})