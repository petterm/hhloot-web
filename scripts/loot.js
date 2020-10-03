const https = require('https');
const Papa = require('papaparse');
const fs = require("fs");

const tabName = "Loot";
const dataFileURL = `https://docs.google.com/a/google.com/spreadsheets/d/1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;

const playersData = fs.readFileSync("../src/data/players.json", { encoding: "utf8" });
const players = JSON.parse(playersData);

const raidLoot = {};
const cap = name => name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();

const addLoot = (date, player, item, bonusPlayers) => {
    if (!date || !player || !item) return;

    if (!(date in raidLoot)) {
        raidLoot[date] = {
            date,
            loot: [],
            itemBonus: [],
        };
    }

    if (!players.find(p => p.name === cap(player))) {
        console.log("Loot for unknown player", player, item);
    }

    raidLoot[date].loot.push({
        character: cap(player),
        item,
    });

    bonusPlayers.forEach(bonusPlayer => {
        raidLoot[date].itemBonus.push({
            character: cap(bonusPlayer),
            item,
        });
    });
};

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
                        const [date, player, item] = row;
                        const bonusPlayers = row.slice(3).filter(val => !!val.length);
                        addLoot(date, player, item, bonusPlayers);
                    }
                });

                fs.writeFile("../src/data/aq40_raids.json", JSON.stringify(Object.values(raidLoot), null, 4), err => {
                    if (err) throw err;
                    console.log('Wrote to file')
                })
            }
        })
    });
});
