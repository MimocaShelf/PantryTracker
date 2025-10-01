import express from 'express'
import cors from 'cors'
import {readPantryItems, readSpecificPantryItems, insertPantryItemToMealPrep, readBreakfastIngredients, readLunchIngredients, readDinnerIngredients, deleteMealPrepItem, checkIfItemRecordExistInMealPrep} from './crud.js'
const app = express();

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())

app.get('/', (req, res) => {
    console.log('root route hit');
    res.send('server is definitely running');
});

//Not Used
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

//function that queries the Nutrition Tracking API (Calorie Ninja) for a specific item and receives the nutrition values that is stored in a list
export async function getAllPantryItems(queryString) {

    //Stores the pantry item name in variable
    const encodedQuery = encodeURIComponent(queryString);

    //Attempts to call the API
    try {
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodedQuery}`, {
            headers: {
                'X-Api-Key': 'Xz2dnc55NIazsDTB8LwepQ==skey8YnBDsAfCttn'
            }
        });

        //Waits for a response from the API and converts into JSON
        const data = await response.json();

        //Maps the returned data into a list
        return  data.items.map(entry => ({
            itemName: entry.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            calories: entry.calories,
            protein: entry.protein_g,
            carbohydrate: entry.carbohydrates_total_g,
            fats: entry.fat_total_g
        }))

    } catch (apiError) {
        console.log(apiError.message);
    }
} 

//API endpoint that retrieves pantry items from database, queries a nutrition API for values and return the results
app.get('/getAllItemsAndNutritionValues', async (req, res) => {

    //function that queries the database for all the pantry items of the user
    readPantryItems(async (err, items) => {
        if(err) {
            return res.status(500).send('Error getting pantry items record from database')
        }
    
        try {
            const queryString = items.map(item => item.item_name).join(' '); //variable that store all pantry items in one line that is seperated in spaces
            const nutritionValues = await getAllPantryItems(queryString); //Calls the Nutrition API and return its result in a list

            if(!nutritionValues || nutritionValues === 0){
                console.log('No items found');
                return res.status(404).send('No Nutrition Items Found');
            }
            
            //Returns the nutrition list as a response
            res.status(200).json(nutritionValues);

         } catch (apiError) {
            console.log(apiError.message);
            res.status(500).send('Error Fetching Nutrition Data')
        }
    });
});

//API endpoint that receives user input indicating a specific item they are looking for, checks the database whether item exist and send a response with the item and its nutrition information
app.post('/submitUserInput', (req, res) => {
    const userInput = req.body.input;
    console.log('Received front frontend', userInput);

    //function that queries the pantry item table using a specific name
    readSpecificPantryItems(userInput, async (err, rows) => {
        if(err){
            res.status(500).send(err.message)
        }

        try {
            const queryString = rows.map(row => row.item_name).join(' '); //variable that store all pantry items in one line that is seperated in spaces
            const nutritionValues = await getAllPantryItems(queryString); //Calls the Nutrition API and return its result in a list

            //Returns the nutrition list as a response
            res.status(200).json(nutritionValues);

        } catch (apiError) {
            console.log(apiError.message);
            res.status(500).send('Error Fetching Nutrition Data')
        }

    })

})

//API endpoint that sets a specific pantry item as a record in the meal prep table
app.post('/addToMealPrep', (req, res) => {
    const itemName = req.body.itemName; //variable storing the ingredient name
    const time = req.body.time; //variable that indicates which specific time ingredient is set in the meal prep e.g. breakfast, lunch or dinner

    console.log('Received front frontend', itemName, ' ', time);

    try {
        //function that attempts to find the specific pantry item record based on the item name received from the request body
        readSpecificPantryItems(itemName, async (err, rows) => {
            if(err){
                res.status(500).send(err.message)
            }  

            //Stores the pantry item ID of that specific pantry item
            const itemId = rows[0].pantry_item_id;

            //Maps meal times to numeric values and retrieves that specific value for the given meal time in order to insert to database
            const mealTimeMap = {Breakfast: 1, Lunch: 2, Dinner: 3}
            const mealSlotId = mealTimeMap[time]
            
            checkIfItemRecordExistInMealPrep(mealSlotId, itemId, async (err, rows) => {
                if(err){
                    res.status(500).send(err.message)
                }  

                    if(rows.length === 1){
                        console.log("Item exist");
                        return res.send({success: false, itemId, mealSlotId})
                    }
                    
                    //Insert a record into the meal prep table with the pantry item ID and meal slot ID
                    insertPantryItemToMealPrep(mealSlotId, itemId, async (err) => {
                        if(err){
                            res.status(500).send(err.message)
                        }   
                        res.send({success: true, itemId, mealSlotId})
                    })

                
            
            })
        })

    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }
})

/**************************************************/
/* API Endpoints and Functions For Meal Prep Page*/
/**************************************************/

//Function that calls the Recipe API (Ninja API) to get different recipes based on certain ingredients
export async function getRecipe(rows) {
    
    //Formats the query to insert all the pantry item names into one line seperated by spaces
     const queryString = rows.map(row => row.item_name).join(' ');
     const encodedQuery = encodeURIComponent(queryString);
     //console.log(queryString);

        try {
            //Call the API Ninja to acquire a recipe based on pantry items
            const response = await fetch(`https://api.api-ninjas.com/v1/recipe?query=${encodedQuery}`, {
                headers: {
                    'X-Api-Key': '56pVmwMXIBB6/OsFU9yBjw==2WphEiN4FEbAQk6E'
                }
            });

            //If API is unable to return a recipe, return undefined
            if(!response.ok){
                const errorText = await response.text();
                console.log('API Error', errorText);
                return undefined;
            }

            //Wait for response body to be parsed as JSON
            const data = await response.json();
            
            //Map over recipe entries
            const recipe = await Promise.all(
                data.map(async entry => ({
                    title: entry.title,
                    ingredients: await convertMeasurementAcronymToWords(entry.ingredients), //function converts measurement acronyms such as c or ts as cup and tablespoons
                    servings: entry.servings,
                    instructions: entry.instructions,
                }))
            )

            return recipe; //return transformed array of recipe objects

        } catch (outerError){
            console.error('Fetch Failed', outerError)
        }
}

//Function that converts measurement acronyms e.g c and ts as cups and tablespoons
async function convertMeasurementAcronymToWords(text){
    return text
        .replace(/\b(\d+(\s\d+\/\d+)?|\d+\/\d+)\s?tb\b/g, '$1 tablespoon')
        .replace(/\b(\d+(\s\d+\/\d+)?|\d+\/\d+)\s?ts\b/g, '$1 teaspoon')
        .replace(/\b(\d+(\s\d+\/\d+)?|\d+\/\d+)\s?c\b/g, '$1 cup')
        .replace(/\|/g, ' | ')
} 

//API Endpoint that gets all the records from the meal prep table that indicate whether a particular ingredient is set to be used during a specific meal time e.g. breakfast
app.get('/getMealPrep', (req, res) => {
    try{

        //Function that gets all the pantry items that is set in the meal plan for breakfast
        readBreakfastIngredients(async (err, breakfastRows) => {
            if(err){ res.status(500).send(err.message) }  

            //Function that gets all the pantry items that is set in the meal plan for lunch
            readLunchIngredients(async (err, lunchRows) => {
                if(err){ res.status(500).send(err.message) }  

                //Function that gets all the pantry items that is set in the meal plan for dinner
                readDinnerIngredients(async (err, dinnerRows) => {
                    if(err){ res.status(500).send(err.message) }  

                    const breakfastItemQuery = breakfastRows.map(breakfastRow => breakfastRow.item_name).join(' '); //Gets all the breakfast pantry items names and store it in a variable as a single line seperated by spaces
                    const lunchItemQuery = lunchRows.map(lunchRow => lunchRow.item_name).join(' '); //Gets all the lunchpantry items names and store it in a variable as a single line seperated by spaces
                    const dinnerItemQuery = dinnerRows.map(dinnerRow => dinnerRow.item_name).join(' '); //Gets all dinner the pantry items names and store it in a variable as a single line seperated by spaces

                    const breakfastItems = await getAllPantryItems(breakfastItemQuery); //Call the Nutrition API to get the nutrition values of all the pantry items set as breakfast in the meal plan
                    const lunchItems = await getAllPantryItems(lunchItemQuery); //Call the Nutrition API to get the nutrition values of all the pantry items set as lunch in the meal plan
                    const dinnerItems = await getAllPantryItems(dinnerItemQuery); //Call the Nutrition API to get the nutrition values of all the pantry items set as dinner in the meal plan

                    //Sends a response with all the meal prep records seperated into different lists for breakfast lunch and dinner
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


//API endpoint that calls the API for a recipe for each meal prep time e.g. breakfast, lunch and dinner
app.get('/getRecipe', (req, res) => {

     try{

        //Function that gets all the pantry items that is set in the meal plan for breakfast
        readBreakfastIngredients(async (err, breakfastRows) => {
            if(err){ res.status(500).send(err.message) }  

            //Function that gets all the pantry items that is set in the meal plan for lunch
            readLunchIngredients(async (err, lunchRows) => {
                if(err){ res.status(500).send(err.message) }  

                //Function that gets all the pantry items that is set in the meal plan for dinner
                readDinnerIngredients(async (err, dinnerRows) => {
                    if(err){ res.status(500).send(err.message) }  

                    //Call a function that call the Recipe API that provides a recipe based on ingredient list for each meal time
                    const breakfastRecipe = await getRecipe(breakfastRows);
                    const lunchRecipe = await getRecipe(lunchRows);
                    const dinnerRecipe = await getRecipe(dinnerRows);

                    //Send an array of recipes as a response
                    res.send({
                        breakfastRecipe : breakfastRecipe,
                        lunchRecipe: lunchRecipe,
                        dinnerRecipe: dinnerRecipe
                    })
                })
            })
        })
    } catch (outerError){
        console.error('Fetch Failed', outerError) //test this
    }
}) 

//API endpoint that removes a pantry item in the meal prep table 
app.post('/removeMealPrepItem', (req, res) => {

    //Stores the items from the request into the different variables
    const itemName = req.body.itemName;
    const time = req.body.time;

    console.log("time", time);

    //Calls a function that queries the database to acquire a pantry item record that matches the item name
    readSpecificPantryItems(itemName, (err, rows) => {
            
            if(err){
                res.status(500).send(err.message)
            }        
            console.log("tetsing", rows[0].pantry_item_id)
            //Calls a function that deletes the meal prep record that matches the pantry item ID and the meal time
            deleteMealPrepItem(rows[0].pantry_item_id, time, err => {
                if(err){ 
                    res.status(500).send(err.message) 
                } else {
                    res.send({success: true, message: 'Item removed'})
                }
            })  
    })  
    
})

//Do not use
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

// Get low stock pantry items
app.get('/getLowStockItems', (req, res) => {
    const LOW_STOCK_THRESHOLD = 2;
    // Query all items and filter in JS, or do it in SQL:
    import('./sql/app.js').then(({ default: db }) => {
        db.all(
            'SELECT * FROM pantry_items WHERE quantity < ?',
            [LOW_STOCK_THRESHOLD],
            (err, rows) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.status(200).json(rows);
                }
            }
        );
    });
});

// --- Shopping List Endpoints ---

// Get all shopping list items
app.get('/getShoppingList', (req, res) => {
    import('./sql/app.js').then(({ default: db }) => {
        db.all('SELECT name, quantity FROM shopping_list', [], (err, rows) => {
            if (err) return res.status(500).send(err.message);
            res.json(rows);
        });
    });
});

// Add an item to the shopping list
app.post('/addShoppingListItem', (req, res) => {
    const { name, quantity } = req.body;
    import('./sql/app.js').then(({ default: db }) => {
        db.get('SELECT * FROM shopping_list WHERE name = ?', [name], (err, row) => {
            if (err) return res.status(500).send(err.message);
            if (row) {
                // If item exists, update quantity
                db.run(
                    'UPDATE shopping_list SET quantity = quantity + ? WHERE name = ?',
                    [quantity, name],
                    function (err) {
                        if (err) return res.status(500).send(err.message);
                        res.json({ success: true, updated: true });
                    }
                );
            } else {
                // Else, insert new item
                db.run(
                    'INSERT INTO shopping_list (name, quantity) VALUES (?, ?)',
                    [name, quantity],
                    function (err) {
                        if (err) return res.status(500).send(err.message);
                        res.json({ success: true, inserted: true });
                    }
                );
            }
        });
    });
});

// Remove an item from the shopping list
app.post('/removeShoppingListItem', (req, res) => {
    const { name } = req.body;
    import('./sql/app.js').then(({ default: db }) => {
        db.run('DELETE FROM shopping_list WHERE name = ?', [name], function (err) {
            if (err) return res.status(500).send(err.message);
            res.json({ success: true });
        });
    });
});

// Update quantity of an item in the shopping list
app.post('/updateShoppingListItem', (req, res) => {
    const { name, quantity } = req.body;
    import('./sql/app.js').then(({ default: db }) => {
        db.run(
            'UPDATE shopping_list SET quantity = ? WHERE name = ?',
            [quantity, name],
            function (err) {
                if (err) return res.status(500).send(err.message);
                res.json({ success: true });
            }
        );
    });
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001/")
})