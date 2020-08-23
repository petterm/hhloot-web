const fs = require("fs");
const Parse = require("papaparse");

const fileData = fs.readFileSync('aq40_loot_table.tsv', 'utf8');

Parse.parse(fileData, {
    encoding: 'utf8',
    delimiter: '\t',
    header: true,
    complete: ({data, errors, meta}, file) => {
        console.log('Errors:', errors);
        console.log('Meta:', meta);

        if (!errors.length) {
            fs.writeFile('output.json', JSON.stringify(data, null, 2), err => {
                if (err) throw err;
                console.log('Wrote to file')
            })
        }
    }
})
