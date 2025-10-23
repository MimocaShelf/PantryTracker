import express from 'express';
import cors from 'cors';
import https from 'https'; // Import https for API requests
import { promisify } from 'util';

import {readPantryItems, readSpecificPantryItems, insertPantryItemToMealPrep, readBreakfastIngredients, readLunchIngredients, readDinnerIngredients, deleteMealPrepItem, checkIfItemRecordExistInMealPrep, deleteRecipe, insertIntoRecipe, checkIfRecipeIsSaved, readAllRecipe, checkForShoppingList, insertShoppingIngredient} from './crud.js'
import {addItemToPantry, getLatestAddedItem, getPantriesForUser, getPantryItemsFromPantryID, getPantryName, getPantryInformation, getLatestAddedItemHistory, getLatestAddedItemFromPantryID, deletePantryItemFromPantryItemID, editItemInPantry, getPantryItemFromPantryItemID} from './pantryLogic.js'
import { readAllPantries, insertPantry, deletePantry } from './crud.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();


const checkForShoppingListAsync = promisify(checkForShoppingList);
const insertShoppingIngredientAsync = promisify(insertShoppingIngredient);
const readSpecificPantryItemsAsync = promisify(readSpecificPantryItems);

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

// --- Coles Product Search API ---
/**
 * Fetch product details from the Coles API based on a query
 */
app.get('/getColesProduct', (req, res) => {
    const productQuery = req.query.query; // Get the product query from the request
    if (!productQuery) {
        return res.status(400).send('Missing "query" parameter');
    }

    const options = {
        method: 'GET',
        hostname: 'coles-product-price-api.p.rapidapi.com',
        port: null,
        path: `/coles/product-search/?query=${encodeURIComponent(productQuery)}`,
        headers: {
            'x-rapidapi-key': '2ab8f6ffd4msh70b8a797bf6ec14p12f920jsn56d934beaef5',
            'x-rapidapi-host': 'coles-product-price-api.p.rapidapi.com',
        },
    };

    const apiRequest = https.request(options, (apiRes) => {
        const chunks = [];

        apiRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        apiRes.on('end', () => {
            const body = Buffer.concat(chunks);
            try {
                const data = JSON.parse(body.toString()); // Parse the API response
                res.status(200).json(data); // Send the parsed data to the client
            } catch (error) {
                console.error('Error parsing Coles API response:', error.message);
                res.status(500).send('Error parsing Coles API response');
            }
        });
    });

    apiRequest.on('error', (error) => {
        console.error('Error calling Coles API:', error.message);
        res.status(500).send('Error calling Coles API');
    });

    apiRequest.end();
});

// --- Woolworths Product Search API ---
/**
 * Fetch product details from the Woolworths API based on a query
 */
app.get('/getWoolworthsProduct', (req, res) => {
    const productQuery = req.query.query; // Get the product query from the request
    if (!productQuery) {
        return res.status(400).send('Missing "query" parameter');
    }

    const options = {
        method: 'GET',
        hostname: 'woolworths-products-api.p.rapidapi.com',
        port: null,
        path: `/woolworths/product-search/?query=${encodeURIComponent(productQuery)}`,
        headers: {
            'x-rapidapi-key': '2ab8f6ffd4msh70b8a797bf6ec14p12f920jsn56d934beaef5',
            'x-rapidapi-host': 'woolworths-products-api.p.rapidapi.com',
        },
    };

    const apiRequest = https.request(options, (apiRes) => {
        const chunks = [];

        apiRes.on('data', (chunk) => {
            chunks.push(chunk);
        });

        apiRes.on('end', () => {
            const body = Buffer.concat(chunks);
            try {
                const data = JSON.parse(body.toString()); // Parse the API response
                res.status(200).json(data); // Send the parsed data to the client
            } catch (error) {
                console.error('Error parsing Woolworths API response:', error.message);
                res.status(500).send('Error parsing Woolworths API response');
            }
        });
    });

    apiRequest.on('error', (error) => {
        console.error('Error calling Woolworths API:', error.message);
        res.status(500).send('Error calling Woolworths API');
    });

    apiRequest.end();
});

// --- Example Root Route ---
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.send('Server is running');
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

//receive post requests, will add an item with the following format
/* example request:
HEADER:
{"Content-Type": "application/json"}


BODY:
{
    "pantry_id": 1,
    "item_name": "Durian",
    "extra_info": "None",
    "quantity": 4,
    "unit": "units"
}
*/
app.post('/postAddItemToPantry', (req, res, next) => {
    console.log('POST postAddItemToPantry received.')
    let body = req.body;

    addItemToPantry(body.pantry_id, body.item_name, body.extra_info, body.quantity, body.unit).then(() => {
        res.status(200).send('Received');
    }).catch(error => {
        res.status(500).send(error.message);
    });
})


//Function primarily used for testing. send a get request, and it will get the last item added in all pantries
app.get('/getLatestAddeditem', (req,res) => {
    console.log('GET getLatestAddeditem received.')
    getLatestAddedItem().then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
    
})
//same thing with the history table
app.get('/getLatestAddedItemHistory', (req,res) => {
    console.log('GET getLatestAddedItemHistory received.')
    getLatestAddedItemHistory().then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
app.get('/getLatestAddedItemHistory', (req,res) => {
    console.log('GET getLatestAddedItemHistory received.')
    getLatestAddedItemHistory().then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
app.post('/postGetLatestAddedItemFromPantryID', (req,res) => {
    console.log('POST postGetLatestAddedItemFromPantryID received.')
    getLatestAddedItemFromPantryID(req.body.pantry_id).then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
    /* example of a returned json 
    {
        "time": "2025-10-22 19:04:34",
        "pantry_item_id": 9,
        "pantry_id": 1,
        "item_name": "Carrots",
        "extra_info": null,
        "quantity": 5,
        "unit": "grams"
    }
    */
})


//Function to get all pantries for a given user
/* example request:
HEADER:
{"Content-Type": "application/json"}


BODY:
{
    "user_id": 1
}
*/
app.post('/postGetPantriesForUser', (req, res, next) => {
    console.log('POST postGetPantriesForUser received')
    getPantriesForUser(req.body.user_id).then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
//gets the pantry name, needs field "pantry_id" in request
app.post('/postGetPantryNameFromPantry', (req, res, next) => {
    console.log('POST postGetPantryNameFromPantry received')
    getPantryName(req.body.pantry_id).then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
//returns a list of pantry items when given the pantry id
app.post('/postGetPantryItemsFromPantryID', (req, res, next) => {
    console.log('POST postGetPantryItemsFromPantryID received')
    getPantryItemsFromPantryID(req.body.pantry_id).then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
app.post('/postDeletePantryItemFromPantryID', (req, res, next) => {
    console.log('POST postDeletePantryItemFromPantryID received')
    deletePantryItemFromPantryItemID(req.body.pantry_item_id).then(value => {
        res.status(200).send('DELETED')
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
app.post('/postEditPantryItemFromPantryItemID', (req, res, next) => {
    console.log('POST postEditPantryItemFromPantryItemID received')
    editItemInPantry(req.body.pantry_item_id, req.body.pantry_id, req.body.item_name, req.body.extra_info, req.body.quantity, req.body.unit).then(value => {
        res.status(200).send('EDITED')
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
//submit all requests, wait for all of them with Promise.all then send.
app.post('/postGetPantrySummaryFromPantryID', (req, res, next) => {
    console.log('POST postGetPantrySummaryFromPantryID received')
    let pantry_id = req.body.pantry_id

    Promise.all([getPantryInformation(pantry_id), getPantryItemsFromPantryID(pantry_id)]).then((data) => {
        let info = data[0];
        let items = data[1];
        res.status(200).json({info: info, items: items})
    }).catch(err => {
        res.status(500).send(err.message)
    })
})
app.post('/postGetPantryItemFromPantryItemID', (req, res, next) => {
    console.log('POST postGetPantryItemFromPantryItemID received')
    getPantryItemFromPantryItemID(req.body.pantry_item_id).then(value => {
        res.status(200).send(value)
    }).catch(err => {
        res.status(500).send(err.message)
    })
})

/**************************************************/
/* API Endpoints and Functions For Nutrition Page */
/**************************************************/


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

export async function getRecipeSingle(item) {
    
     const encodedQuery = encodeURIComponent(item);
     console.log(encodedQuery);

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
            console.log('testing');

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

/**************************************************/
/*  API Endpoints and Functions For Recipe Page   */
/**************************************************/

//API endpoint that calls the API to get a recipes for each pantry item
app.get('/getRecipeForEachItem', (req, res) => {

     try{
        readPantryItems(async (err, items) => { //Queries the database to get all the pantry items
            if(err) {
                return res.status(500).send('Error getting pantry items record from database')
            }

            try {
                const results = await Promise.all(items.map(item => getRecipeSingle(item.item_name))); //Ensure that all pantry items are passed to a function that should provide a specific recipe as a response

                const recipes = await Promise.all(results.flat().map(p => p)); //Store all the recipes into a single variable

                res.json(recipes) //Send the recipe list in a JSON format as a response

            } catch(innerError){
                console.log('Error', innerError);
                res.status(500).send('Error Fetching Recipes');
            }
            
        })

    } catch (outerError){
        console.error('Fetch Failed', outerError) //test this
    }
}) 


//API Endpoint that gets the recipe details based on the name
app.post('/getSpecificRecipe', async (req, res) => {
    const recipe = req.body.recipe;

    try {
        const results = await getRecipeSingle(recipe); //Calls the function to query the external API to get the recipe details based on the recipe name

        res.json(results) //Sends the recipe details as a JSON response

    } catch(innerError){
        console.log('Error', innerError);
        res.status(500).send('Error Fetching Recipes');
    }
                
})

//API Endpoint that provides a list of all the recipes the user has saved
app.get('/getSavedRecipe', (req, res) => {

     try{
        //Queries the database to retrieve all the records from the recipe table (which represent all the recipes the user has saved)
         readAllRecipe(async (err, items) => { 
                if(err) {
                    return res.status(500).send('Error getting pantry items record from database')
                }

                try {
                    const results = await Promise.all(items.map(item => getRecipeSingle(item.recipe_name))); //Ensure that all pantry items are passed to a function that should provide a specific recipe as a response

                    const recipes = await Promise.all(results.flat().map(p => p)); //Store all the recipes into a single variable

                    res.json(recipes) //Send the recipe list in a JSON format as a response

                } catch(innerError){
                    console.log('Error', innerError);
                    res.status(500).send('Error Fetching Recipes');
                }
                
            })

    } catch (outerError){
        console.error('Fetch Failed', outerError) //test this
    }
}) 

//API Endpoint that removes a recipe from their saved recipe list
app.post('/removeRecipe', (req, res) => {

    //Gets the recipe name from the request message
    const recipe = req.body.recipe;

    //Calls a CRUD function that deletes the recipe recorded that matches the recipe name
    deleteRecipe(recipe, err => {
        if(err){ 
            res.status(500).send(err.message) 
        } else {
            res.send({success: true, message: 'Recipe removed'})
        }
    })  
    
})

//API Endpoint that adds the list of ingredients to the user's shopping list
app.post('/addToShoppingList', async (req, res) => {

    const ingredients = req.body.ingredients; //Extract the ingredients list from the request message

    const ingredientList = extractIngredientList(ingredients) //Calls a function that extracts that removes the measurements and splits ingredient string to become a list of ingredients

    try {
        //Loops through each ingredient in the ingredient list
        for(const ingredient of ingredientList){

            const name = ingredient.toLowerCase();

            const inPantry = await readSpecificPantryItemsAsync(name); //Check if the ingredient is already listed as a record in the user's pantry
            const inShoppingList = await checkForShoppingListAsync(name); //Check if the ingredient is already a record in the user's shopping list

            //If there are no records retrieve (indicating the ingredient is in neither tables), add a new record with the ingredient name and quantity as 1
            if(inPantry.length === 0 && inShoppingList.length === 0){
                await insertShoppingIngredientAsync(name, 1)
            } else {
                console.log('item in system');
            }

        }
        //Send a response back to the frontend indicated the ingredient has been added to the shopping list
        res.status(200).json({message: 'shopping list updated successfully'});
        
    } catch(error) {
        console.error('Error updating shopping list', error);
        res.status(500).json({error: 'Internal server error'});
    }
     
    
})

//Function that removes the measurements such as '1 cup,' '2 tablespoon'
function extractIngredient(ingredientList) {
    return ingredientList.replace(/^\d+\/?\d*\s*(cup|tablespoon|teaspoon)?\s*/i, '').trim();
}

//Function that splits the ingredient string into a list instead by splitting whenever a '|' character is encountered
//Removes any words that is followed by ':' to eliminate the ingredient categories
function extractIngredientList(ingredientList) {
    return ingredientList.split('|').map(item=> item.trim()).filter(item => item && !item.endsWith(':')).map(extractIngredient);
}

//API endpoint that allow users to save recipes
app.post('/addToSavedRecipes', (req, res) => {

    const recipe = req.body.recipe; //Extracts the recipe name from the request message

    try {
        //Function that checks whether the recipe is already saved in the database (indicating its a 'saved' recipe)
        checkIfRecipeIsSaved(recipe, async (err, rows) => {
            if(err){
                res.status(500).send(err.message)
            }  

            //If there is a record present, return a response message indicating 'failed' to save to database due to record existing
            if(rows.length === 1){
                console.log("Item exist");
                return res.send({success: false, recipe})
            }
            
            //Insert a record into the recipe table with the recipe name
            insertIntoRecipe(recipe, async (err) => {
                if(err){
                    res.status(500).send(err.message)
                }   
                res.send({success: true, recipe}) //Return a response message to indicate recipe has been successfully saved in the database
            })

        })

    } catch (outerError){
        res.status(500).send('Unexpected Error');
    }
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



// --- User Endpoints ---
app.use('/user', userRoutes);

// --- Auth Endpoints ---
app.use('/auth/', authRoutes);

// --- Pantry Section Endpoints ---
app.get('/getAllPantries', (req, res ) => {
    readAllPantries((err, rows) => {
        if(err) {
            res.status(500).send(err.message);
        }else{
            res.status(200).json(rows);
        }
    });
});

app.post('/addPantry', (req, res) => {
  console.log("Received pantry POST:", req.body); // This should log to terminal

  const { pantry_owner, pantry_name } = req.body;
  if (!pantry_owner || !pantry_name) {
    return res.status(400).send('Missing pantry_owner or pantry_name');
  }

  insertPantry(pantry_owner, pantry_name, (err, result) => {
    if (err) {
      console.error("Insert error:", err.message);
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ message: 'Pantry added', pantry_id: result.pantry_id });
    }
  });
});

app.delete('/deletePantry/:id', (req, res) => {
  const pantryId = req.params.id;

  deletePantry(pantryId, (err, result) => {
    if (err) {
      console.error("Delete error:", err.message);
      res.status(500).send("Failed to delete pantry");
    } else {
      res.status(200).json({ message: "Pantry deleted", changes: result.changes });
      console.log(`Deleting pantry with ID: ${pantryId}`);

    }
  });
});


app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001/");
});