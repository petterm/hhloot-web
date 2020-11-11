import Axios from "axios";
import { itemScores } from "../constants";
import { Instance, Item, ItemScore, Player, PlayerName } from "../types";
import { getItem } from "./loot";

export type ReservationsList = { [score in ItemScore]: Item | {} };

export const submitReservations = async (player: Player, instance: Instance, reservations: ReservationsList) => {
    const data = {
        name: player.name,
        instance: instance,
        slots: itemScores.map(score => reservations[score])
    }

    return Axios.post('/Api/reservations', data)
        .then(response => {
            console.log('Posted new reservations', response.data);
            return response.data;
        });
};

export type ApiResponseReservationsList = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    approved?: string,
    approvedBy?: PlayerName,
    slots: string[],
}[];

export type AdminReservationsEntry = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    approved?: string,
    approvedBy?: PlayerName,
    slots: (Item | undefined)[],
};

export const getReservations = async (approved: boolean, instance: Instance | undefined, player?: Player) => {
    const url = approved ? '/Api/reservations/approved' : '/Api/reservations';
    const params = {
        instance,
        player: player ? player.name : undefined,
    };

    return Axios.get<ApiResponseReservationsList>(url, { params })
        .then(response => response.data.map(entry => ({
            id: entry.id,
            name: entry.name,
            instance: entry.instance,
            submitted: entry.submitted,
            approved: entry.approved,
            approvedBy: entry.approvedBy,
            slots: entry.slots.map(itemName => itemName ? getItem(itemName) : undefined),
        })));
};
