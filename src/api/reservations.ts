import { itemScores } from "../constants";
import { Item, ItemScore, Player } from "../types";
import { appendSheet } from "./sheets";

export type ReservationsList = { [score in ItemScore]: Item | {} };

export const submitReservations = async (player: Player, reservations: ReservationsList) => {
    const values = [
        player.name,
        (new Date()).toISOString().substr(0, 19),
        'FALSE'
    ];

    for (const i in itemScores) {
        const score = itemScores[i];
        const slot = reservations[score];
        values.push('name' in slot ? slot.name: '');
    }
    
    const result = await appendSheet('1ErIpL95j-YgJEelmNuPhKN5ugzxWrTc3dwOLBWPhBiA', 'Reservations', values);

    console.log(`Updated ${result} fields`);

    return result;
};
