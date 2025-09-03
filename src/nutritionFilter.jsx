import React, {useState} from 'react';

function NutritionFilterLogic(){
    const [searchWord, setSearchWord] = useState('');
    let content;

    let pantryItemsList = [
        //contain pantry items list from the database
    ];

    //Lines of code to fetch the record which has a pantry name similar to the searchWord proviedd to the user
    /*
        useEffect(() => {
            const fetchItems = async () => {
                const res = await axios.get();
                setPantryItemsList(res.data);
            }    
        })
    */

    if(filteredItems.length > 0) {
        content = pantryItemsList.map(item => (
            <div class="nutritionBox">
                <div class="left-container">
                    <h2>{item.name}</h2>
                </div>
                <div class="right-container">
                    <h3>Calories: {item.calories}</h3>
                    <h3 id="purple-text">Protein: {item.protein}</h3>
                    <h3 id="pink-text">Carbs: {item.carbs}</h3>
                    <h3 id="lavender-text">Fats: {item.fats}</h3>
                </div>
            </div>
        ));
    } else {
        content = <p>No Matching Items Found.</p>;
    }

    return <div>{content}</div>


}