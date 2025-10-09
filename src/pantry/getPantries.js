//function to populate pantries map
async function getPantries(user_id) {
        return await fetch('http://localhost:3001/postGetPantriesForUser', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'user_id': user_id})
            }
        ).then((response) => {
            return response.json();
        })
        // .then(json => {
        //     // console.log(json)
        //     return json
        // })

        // console.log(fetchedMap)
        // return await fetchedMap.json();
    }

export {getPantries};