const express = require('express');
const axios = require('axios');
// FOR TASK 1
//const fs = require('fs');
const DEV_PORT = 3000;
let API_URL;

// HIDE THE API ENDPOINT TO KEEP THE CLIENT'S NAME SECRET
if(process.env.node_env === 'production'){
    API_URL = process.env.API_URL
} else {
    API_URL = require('./config/keys').API_URL;
}

// Start Express instance
const app = express();

// DEFINE HELPER FUNCTIONS

/**
 * TASK 1 : Reads JSON file, parse and returns its content
 * TASK 3 : fetch the players list from remote API and returns it
 * @returns object[] the unsorted list of players 
 */
const getPlayersList = async () => {
    // FOR TASKS 1 & 2
    // const jsonFile = fs.readFileSync('./data/headtohead.json');
    // const jsonObject = JSON.parse(jsonFile);
    // const playersList = jsonObject.players;

    // FOR TASK 3
    let playersList;
    // Fetch the data from remote API
    const APIresponse = await axios.get(API_URL)
    .catch(e => console.log(e));
    // If the fetch was succesfull, define the data to be returned
    if(APIresponse.status === 200){
        playersList = APIresponse.data.players;    
    }
    return playersList;
}

/**
 * Searches the player's list for an item with matching ID.
 * @param {number} playerId 
 */
const getPlayerInfo = async (playerId) => {
    // Retrieve the list
    const playersList =  await getPlayersList();
    let playerInfo;
    // Loop over the players list to see if any player has the right ID.
    for (let i = 0; i < playersList.length; i++){
        const player = playersList[i];
        if (player.id === playerId){
            // If the player's id matches the one recieved in args, 
            //define the info to return and break the loop.
            playerInfo = player;
            break;
        }
    }

    return playerInfo;
}

// SETUP THE ROUTES
app.get('/players/:id', async (req, res) => {
    // Retrieve the player info with the request's params
    const id = req.params.id;
    let playerId;
    playerId = parseInt(id);
    // Check if we found a player with this ID.
    const playerInfo = await getPlayerInfo(playerId);
    if (typeof playerInfo === 'object'){
        // Send response with the found info.
        const body = JSON.stringify(playerInfo);
        return res.send(body);
    } 
    // Send response with error info.
    res.status(404);
    res.send('Sorry, no player found with this ID.');
});

app.get('/players', async (req, res) => {
    let playersList = await getPlayersList();
    // Sort the list by growing ID
    playersList.sort((a, b) => (a.id > b.id) ? 1 : -1);
    const body = JSON.stringify(playersList);
    res.send(body);
});

// Set up the port and start the server.
const port  = process.env.PORT || DEV_PORT;
module.exports = app.listen(port, () => console.log('listening on port: ' + port));

// SETUP THE EXPORTS FOR TESTING
// module.exports.getPlayerInfo = getPlayerInfo;
// module.exports.getPlayersList = getPlayersList;