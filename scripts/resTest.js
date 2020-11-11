const fs = require("fs");
const moment = require("moment");

const newData = [];
let id = 1;

const itemScores = [
    100, 90, 80, 70, 65, 60, 55, 54, 53, 52,
];

const reservationData = fs.readFileSync("reservations.json", { encoding: "utf8" });
const reservations = JSON.parse(reservationData);
const dateFormat = 'YYYY-MM-DD HH.mm.ss';


Object.values(reservations).forEach(entries => {
    entries.forEach((entry, index) => {
        const approved = index % 2;
        newData.push({
            id: id++,
            name: entry.character,
            submitted: entry.date,
            approved: approved ? moment(entry.date, dateFormat).add(1, 'hour').format(dateFormat) : null,
            approvedBy: approved ? 'Meche' : null,
            instance: 'aq40',
            slots: itemScores.map(score => entry[`${score}_score`] || null),
        });
    })
});

fs.writeFile('../server/scenarios/reservationsApi.json', JSON.stringify(newData, null, 2), err => {
    if (err) throw err;
    console.log('Wrote to file', 'reservationsApi.json')
});
