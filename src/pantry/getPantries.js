//function to populate pantries map
async function getPantries(user_id) {
        let fetchedMap = await fetch('http://localhost:3001/postGetPantriesForUser', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'user_id': user_id})
            }
        )

        console.log(fetchedMap)
        return await fetchedMap.json();
    }

export {getPantries};