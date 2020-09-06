const fs = require("fs");
const Papa = require('papaparse');

const fileData = fs.readFileSync('lootDump.csv', 'utf8');

Papa.parse(fileData, {
    delimiter: '\t',
    complete: ({ data, errors, meta }) => {
        console.log('Errors:', errors);
        console.log('Meta:', meta);
        // console.log('Data:', data);

        if (!errors.length) {

            const raids = {};
            data.forEach((row) => {
                const [date, character, item] = row;
                const bonusCharacters = row.slice(3);
                if (!raids[date]) {
                    raids[date] = {
                        date,
                        players: [],
                        loot: [],
                        itemBonus: [],
                    }
                }
                raids[date].loot.push({
                    character,
                    item,
                })
                bonusCharacters.forEach((character) => {
                    if (character.length) {
                        raids[date].itemBonus.push({
                            character,
                            item,
                        })
                    }
                })
            })


            fs.writeFile('lootOutput.json', JSON.stringify(Object.values(raids), null, 2), err => {
                if (err) throw err;
                console.log('Wrote to file')
            })
        }
    }
});

