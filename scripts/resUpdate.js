const fs = require("fs");
const Axios = require("axios");

const loot = fs.readFileSync("../src/data/aq40_loot_table.json", { encoding: "utf8" });
const lootFromId = {};
JSON.parse(loot).forEach(loot => lootFromId[loot['Item ID']] = loot['Item Name']);

const reservationData = fs.readFileSync("../src/data/aq40_reservation.json", { encoding: "utf8" });
const localReservations = {};
JSON.parse(reservationData).forEach(res => localReservations[res.character] = res);

const compareLoot = (localRes, apiRes) => {
    if (localRes === '') {
        return apiRes === null;
    }
    return apiRes && lootFromId[apiRes] === localRes;
};

Axios.get('https://hubbe.myddns.me/api/reservations/approved').then((response) => {
    const missmatched = [];
    response.data.forEach(apiRes => {
        const name = apiRes.name;
        const equal = compareLoot(localReservations[name]['100_score'], apiRes.slots[0]) &&
            compareLoot(localReservations[name]['90_score'], apiRes.slots[1]) &&
            compareLoot(localReservations[name]['80_score'], apiRes.slots[2]) &&
            compareLoot(localReservations[name]['70_score'], apiRes.slots[3]) &&
            compareLoot(localReservations[name]['65_score'], apiRes.slots[4]) &&
            compareLoot(localReservations[name]['60_score'], apiRes.slots[5]) &&
            compareLoot(localReservations[name]['55_score'], apiRes.slots[6]) &&
            compareLoot(localReservations[name]['54_score'], apiRes.slots[7]) &&
            compareLoot(localReservations[name]['53_score'], apiRes.slots[8]) &&
            compareLoot(localReservations[name]['52_score'], apiRes.slots[9]);

        if (!equal) missmatched.push(localReservations[name]);
    });

    fs.writeFile('resNeedUpdate.json', JSON.stringify(missmatched, null, 2), err => {
        if (err) throw err;
        console.log('Wrote to file', 'resNeedUpdate.json');
    });
}).catch(err => console.error(err));
