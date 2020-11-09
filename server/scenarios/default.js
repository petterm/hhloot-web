const reservations = require('./reservations');
const players = require('./players');

module.exports = {
    endpoints: [].concat(
        reservations.endpoints,
        players.endpoints,
    ),
};
