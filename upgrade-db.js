process.stdin.resume();
process.stdin.setEncoding('utf8');

var data = ""

process.stdin.on('data', function(chunk) {
    data += chunk
});

/*
 {
    "data": {
        [user]: {
            "items": {
                [ID]: [ITEM]
            }
        }
    }
}
*/

/**
 * Update every property of an object with the trans function
 * @param {Object} origObj 
 * @param {(any) => any} trans 
 */
function updateObject(origObj, trans) {
    if (!origObj) return origObj
    return Object.fromEntries(
        Object.entries(origObj)
            .map(([key, value]) => ([key, trans(value)]))
    )
}

process.stdin.on('end', function() {
    const db = JSON.parse(data)
    const upgradedDbData = {
        data: updateObject(db.data, user => ({
            ...user,
            items: updateObject(user.items, item => ({
                ...item,
                lastChange: Date.now()
            }))
        }))
    }
    console.log(JSON.stringify(upgradedDbData, null, "  "))
});