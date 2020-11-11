const fs = require("fs");
const path = require('path');
const moment = require('moment');
const reservationString = fs.readFileSync(path.join(__dirname, 'reservationsApi.json'), { encoding: "utf8" });
const reservationsData = JSON.parse(reservationString);
reservationsData.sort((a, b) => a.submitted > b.submitted);
const dateFormat = 'YYYY-MM-DD HH.mm.ss';

const newSubmit = {
    "id": 999,
    "name": "Meche",
    "submitted": moment().subtract(1, 'hour').format(dateFormat),
    "approved": null,
    "approvedBy": null,
    "instance": "aq40",
    "slots": [
        "Carapace of the Old God",
        "Breastplate of Annihilation",
        "Qiraji Bindings of Command",
        "Imperial Qiraji Armaments",
        "Ouro's Intact Hide",
        "Vek'nilash's Circlet",
        null,
        "Barbed Choker",
        "Cloak of the Golden Hive",
        "Mark of C'Thun"
    ]
};

const newSubmitApproved = {
    "id": 999,
    "name": "Meche",
    "submitted": moment().subtract(1, 'hour').format(dateFormat),
    "approved": moment().format(dateFormat),
    "approvedBy": 'Meche',
    "instance": "aq40",
    "slots": [
        "Carapace of the Old God",
        "Breastplate of Annihilation",
        "Qiraji Bindings of Command",
        "Imperial Qiraji Armaments",
        "Ouro's Intact Hide",
        "Vek'nilash's Circlet",
        null,
        "Barbed Choker",
        "Cloak of the Golden Hive",
        "Mark of C'Thun"
    ]
};

module.exports = {
    endpoints: [
        {
            request: {
                method: 'GET',
                path: '/reservations/approved',
                cookies: {
                    submitted: '1',
                    approved: '1',
                }
            },
            response: {
                data: Object.values(reservationsData.reduce((prev, current) => {
                    if (current.approved) {
                        if (!(current.name in prev) || prev[current.name].approved < current.approved) {
                                prev[current.name] = current;
                        }
                    }
                    return prev;
                }, { 'Meche': newSubmitApproved })),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations/approved',
                cookies: {
                    submitted: '1'
                }
            },
            response: {
                data: Object.values(reservationsData.reduce((prev, current) => {
                    if (current.approved) {
                        if (!(current.name in prev) || prev[current.name].approved < current.approved) {
                                prev[current.name] = current;
                        }
                    }
                    return prev;
                }, { 'Meche': newSubmit })),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations/approved',
            },
            response: {
                data: Object.values(reservationsData.reduce((prev, current) => {
                    if (current.approved) {
                        if (!(current.name in prev) || prev[current.name].approved < current.approved) {
                                prev[current.name] = current;
                        }
                    }
                    return prev;
                }, {})),
            },
        },
        {
            request: {
                method: 'POST',
                path: '/reservations/approve',
            },
            response: {
                data: newSubmitApproved,
                cookies: {
                    submitted: '1',
                    approved: '1',
                },
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    player: 'Meche',
                },
                cookies: {
                    submitted: '1',
                    approved: '1',
                },
            },
            response: {
                data: reservationsData.filter(entry => entry.name === 'Meche').concat([newSubmitApproved]),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    player: 'Meche',
                },
                cookies: {
                    submitted: '1',
                }
            },
            response: {
                data: reservationsData.filter(entry => entry.name === 'Meche').concat([newSubmit]),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    player: 'Meche',
                }
            },
            response: {
                data: reservationsData.filter(entry => entry.name === 'Meche'),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    instance: 'aq40',
                },
                cookies: {
                    submitted: '1',
                    approved: '1',
                },
            },
            response: {
                data: reservationsData.filter(entry => entry.instance === 'aq40').concat([newSubmitApproved]),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    instance: 'aq40',
                },
                cookies: {
                    submitted: '1',
                },
            },
            response: {
                data: reservationsData.filter(entry => entry.instance === 'aq40').concat([newSubmit]),
            },
        },
        {
            request: {
                method: 'GET',
                path: '/reservations',
                query: {
                    instance: 'aq40',
                }
            },
            response: {
                data: reservationsData.filter(entry => entry.instance === 'aq40'),
            },
        },
        {
            request: {
                method: 'POST',
                path: '/reservations',
            },
            response: {
                data: newSubmit,
                cookies: {
                    submitted: '1',
                },
            },
        },

        {
            request: {
                method: 'GET',
                path: '/reservations',
            },
            response: {
                data: reservationsData,
            },
        },
    ],
};
