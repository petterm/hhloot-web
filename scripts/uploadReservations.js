const Axios = require('axios');
const fs = require('fs');

const reservationData = fs.readFileSync('../src/data/aq40_reservation.json', { encoding: "utf8" });
const reservations = JSON.parse(reservationData);

const lootData = fs.readFileSync('../src/data/aq40_loot_table.json', { encoding: "utf8" });
const loot = JSON.parse(lootData);
const lootMap = loot.reduce((prev, curr) => ({...prev, [curr['Item Name']]: parseInt(curr['Item ID'])}), {});

const upload = async (entry) => {
    console.log('Submit', entry.character);
    const submitData = {
        name: entry.character,
        instance: 'aq40',
        slots: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52]
            .map(score => entry[`${score}_score`] ? lootMap[entry[`${score}_score`]] : null),
    };
    try {
        const postResponse = await Axios.post('https://hubbe.myddns.me/api/reservations', submitData)
        console.log('Reservation posted', entry.character, postResponse.data.id);

        const approveData = {
            id: postResponse.data.id,
            approver: 'Meche',
        };
        try {
            await Axios.post('https://hubbe.myddns.me/api/reservations/approve', approveData)
            console.log('Reservation approved', entry.character, postResponse.data.id);
        } catch (error) {
            console.error(error);
            console.log(approveData);
        }
    } catch (error) {
        console.error(error);
        console.log(submitData);
    }
}

const uploadAll = async () => {
    for (const entry of reservations) {
        await upload(entry);
    }
}

uploadAll();
