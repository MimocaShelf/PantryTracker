//function which does a fetch request for pantries when given a user_id
async function getPantries(user_id) {
    return await fetch('http://localhost:3001/postGetPantriesForUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'user_id': user_id })
    }
    ).then((response) => {
        return response.json();
    })
}
//fetch request for pantry items from pantry id
async function getPantryItems(pantry_id) {
    return await fetch('http://localhost:3001/postGetPantryItemsFromPantryID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_id': pantry_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function getPantryName(pantry_id) {
    return await fetch('http://localhost:3001/postGetPantryNameFromPantry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_id': pantry_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function getPantryInformation(pantry_id) {
    return await fetch('http://localhost:3001/postGetPantrySummaryFromPantryID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_id': pantry_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function getLatestPantryItem(pantry_id) {
    return await fetch('http://localhost:3001/postGetLatestAddedItemFromPantryID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_id': pantry_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function postDeletePantryItem(pantry_item_id) {
    return await fetch('http://localhost:3001/postDeletePantryItemFromPantryID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_item_id': pantry_item_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function getPantryItem(pantry_item_id) {
    return await fetch('http://localhost:3001/postGetPantryItemFromPantryItemID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_item_id': pantry_item_id })
    }
    ).then((response) => {
        return response.json();
    })
}
async function getPantryHistory(pantry_id) {
    return await fetch('http://localhost:3001/postGetPantryHistoryFromPantryID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'pantry_id': pantry_id })
    }
    ).then((response) => {
        return response.json();
    })
}


async function getUser(user_id) {
    return await fetch('http://localhost:3001/postGetPantryUserFromUserID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'user_id': user_id })
    }
    ).then((response) => {
        return response.json();
    })
}

export { getUser, getPantries, getPantryItems, getPantryName, getPantryInformation, getLatestPantryItem, postDeletePantryItem, getPantryItem, getPantryHistory };

