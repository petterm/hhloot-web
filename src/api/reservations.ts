import Axios from "axios";
import { itemScores } from "../constants";
import { Instance, Item, ItemScore, Player, PlayerName } from "../types";
import { ReservationApprovePostRequest, ReservationApprovePostResponse,
    ReservationPostRequest, ReservationPostResponse, ReservationsResponse } from "./apiTypes";
import { getItem } from "./loot";

export type ReservationsList = Partial<Record<ItemScore, Item>>;

const idOrNull = (item: Item | undefined): (number | null) => (item && item.id) || null;

export const submitReservations = async (player: Player, instance: Instance, reservations: ReservationsList) => {
    const data: ReservationPostRequest = {
        name: player.name,
        instance: instance,
        slots: itemScores.map(score => idOrNull(reservations[score]))
    }

    return Axios.post<ReservationPostResponse>('/Api/reservations', data)
        .then(({ data }) => data);
};

export type AdminReservationsEntry = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    approved?: string,
    approvedBy?: PlayerName,
    slots: (Item | undefined)[],
};

export const getReservations = async (
    approved: boolean,
    instance: Instance | undefined,
    player?: Player
): Promise<AdminReservationsEntry[]> => {
    const url = approved ? '/Api/reservations/approved' : '/Api/reservations';
    const params = {
        instance,
        player: player ? player.name : undefined,
    };

    return Axios.get<ReservationsResponse>(url, { params })
        .then(({ data }) => data.map(entry => ({
            id: entry.id,
            name: entry.name,
            instance: entry.instance,
            submitted: entry.submitted,
            approved: entry.approved,
            approvedBy: entry.approvedBy,
            slots: entry.slots.map(itemId => itemId ? getItem(itemId) : undefined),
        })));
};

export const approveReservation = async (reservationId: number, approver: Player): Promise<AdminReservationsEntry> => {
    const url = '/api/reservations/approve';
    const data: ReservationApprovePostRequest = {
        id: reservationId,
        approver: approver.name,
    }

    return Axios.post<ReservationApprovePostResponse>(url, data)
        .then(({ data }) => ({
            id: data.id,
            name: data.name,
            instance: data.instance,
            submitted: data.submitted,
            approved: data.approved,
            approvedBy: data.approvedBy,
            slots: data.slots.map(itemId => itemId ? getItem(itemId) : undefined),
        }));
};