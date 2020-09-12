const https = require('https');
const Papa = require('papaparse');
const fs = require("fs");

const dataFileURL = "https://docs.google.com/a/google.com/spreadsheets/d/1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw/gviz/tq?tqx=out:csv&sheet=Formul%C3%A4rsvar%201";

const players = {};

const addReservation = ([
    date,
    playerNameRaw,
    slot100,
    slot90,
    slot80,
    slot70,
    slot65,
    slot60,
    slot55,
    slot54,
    slot53,
    slot52,
]) => {
    const playerName = playerNameRaw.substr(0, 1).toUpperCase() + playerNameRaw.substr(1).toLowerCase();
    if (!(playerName in playerList)) {
        console.log("Invalid player", playerName);
        return;
    }
    if (!(playerName in players)) {
        players[playerName] = [];
    }

    players[playerName].push({
        date,
        "character": playerName,
        "100_score": slot100,
        "90_score": slot90,
        "80_score": slot80,
        "70_score": slot70,
        "65_score": slot65,
        "60_score": slot60,
        "55_score": slot55,
        "54_score": slot54,
        "53_score": slot53,
        "52_score": slot52,
    })

    players[playerName].sort((a, b) => a.date > b.date);
};

const playerData = fs.readFileSync("../src/data/players.json", { encoding: "utf8" });
const playerList = JSON.parse(playerData).reduce((result, player) => {
    result[player.name] = true;
    return result;
}, {});


https.get(dataFileURL, function(response) {
    let str = "";

    response.on("data", (chunk) => {
        str += chunk;
    });

    response.on("end", () => {
        Papa.parse(str, {
            complete: ({ data, errors, meta }) => {
                data.forEach((row, index) => {
                    if (index) {
                        addReservation(row)
                    }
                });

                fs.writeFile('reservations.json', JSON.stringify(players, null, 2), err => {
                    if (err) throw err;
                    console.log('Wrote to file')
                })
            }
        })
    });
});
