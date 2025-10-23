import React, { useState, useEffect } from 'react';
import { getPantryInformation, getLatestPantryItem, getPantryHistory} from './getPantries';


/*
FEATURES:
- Click on a pantry and view & edit information about it
    - Pantry Name 
    - Pantry Owner
    - Last Updated Pantry Item
    - Most used pantry item
    - Number of items in the pantry
    - Pie chart of pantry item updates

*/

function PantrySummary() {
    let getPantryID = localStorage.getItem('pantry_id');
    let pantry_id = (getPantryID != null) ? parseInt(getPantryID) : 1;


    let getPantryInformationFromPantryID = getPantryInformation(pantry_id);
    let getLatestPantryItemFromPantryID = getLatestPantryItem(pantry_id);
    let getPantryHistoryFromPantryID = getPantryHistory(pantry_id);

    let [pantryInfo, setPantryInfo] = useState({})
    let [pantryItems, setPantryItems] = useState([])
    let [latestPantryItem, setLatestPantryItem] = useState({})
    let [pantryHistory, setPantryHistory] = useState([])

    function convertStatus(string) {
        switch (string) {
            case 'C':
                return 'Created';
            case 'R':
                return 'Read';
            case 'U':
                return 'Updated';
            case 'D':
                return 'Deleted';
        }
    } 

    async function updatePantryInfo() {
        await getPantryInformationFromPantryID.then((data) => {
            setPantryInfo(data.info)
            setPantryItems(data.items)
        })
    }
    async function updatePantryHistory() {
        await getPantryHistoryFromPantryID.then((data) => {
            setPantryHistory(data)
        })
    }
    async function updateLatestPantryItem() {
        await getLatestPantryItemFromPantryID.then((data) => {
            setLatestPantryItem(data)
            console.log(latestPantryItem)
        })
    }

    useEffect(() => {
        updatePantryInfo();
        updateLatestPantryItem();
        updatePantryHistory();
    }, [pantryInfo.pantry_name])

    let extraInfoText = (extra_info) => {
        if (extra_info != null) {
            return "with extra info \""+extra_info+"\""
        }
        return null;
    }

    return (
        <div className="PantrySummary">
            <div class="section">
                <a href="pantryview"><button type="button">Go Back to the Pantry View</button></a>
                <h1>Pantry Summary for {pantryInfo.pantry_name}</h1>
                <div class="genericContentBox">
                    <h2>Owner</h2>
                    <p>{pantryInfo.pantry_owner}</p>
                    <h2>Pantry ID</h2>
                    <p>{pantryInfo.pantry_id}</p>
                    <h2>Pantry Size</h2>
                    <p>{pantryInfo.pantry_name} has {pantryItems.length} item types</p>
                    <h2>Latest Pantry Item</h2>
                    <p>{latestPantryItem.item_name} ({latestPantryItem.quantity} {latestPantryItem.unit}) added on {latestPantryItem.time} {extraInfoText(latestPantryItem.extra_info)}</p>
                    <h2>Pantry History</h2>
                    <table class='table'>
                        <tr>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Item ID</th>
                            <th>Pantry ID</th>
                            <th>Item Name</th>
                            <th>Extra Info</th>
                            <th>Quantity</th>
                            <th>Units</th>
                        </tr>
                        {
                            pantryHistory.map(entry => (
                                <tr >
                                    <td>{convertStatus(entry.status)}</td>
                                    <td>{entry.time}</td>
                                    <td>{entry.pantry_item_id}</td>
                                    <td>{entry.pantry_id}</td>
                                    <td>{entry.item_name}</td>
                                    <td>{entry.extra_info}</td>
                                    <td>{entry.quantity}</td>
                                    <td>{entry.unit}</td>
                                </tr>
                            ))
                        }

                    </table>
                </div>
            </div>
        </div>
    );
}
export default PantrySummary;