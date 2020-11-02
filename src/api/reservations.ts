import { Item, ItemScore, Player } from "../types";

export type ReservationsList = { [score in ItemScore]: Item | {} };

export const submitReservations = (player: Player, reservations: ReservationsList) => {
    console.log('TODO Submit reservations', player, reservations);
};
