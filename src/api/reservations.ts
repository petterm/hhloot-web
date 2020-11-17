import Axios from "axios";
import { getPlayer } from ".";
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
    player: Player,
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
    const url = approved ? '/api/reservations/approved' : '/api/reservations';
    const params = {
        instance,
        player: player ? player.name : undefined,
    };

    return Axios.get<ReservationsResponse>(url, { params })
        .then(({ data }) => {
            const filteredResult: AdminReservationsEntry[] = [];
            data.forEach(entry => {
                const player = getPlayer(entry.name);
                if (player) {
                    filteredResult.push({
                        id: entry.id,
                        player,
                        instance: entry.instance,
                        submitted: entry.submitted,
                        approved: entry.approved,
                        approvedBy: entry.approvedBy,
                        slots: entry.slots.map(itemId => itemId ? getItem(itemId) : undefined),
                    });
                }
            });
            return filteredResult;
        });
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
            player: getPlayer(data.name),
            instance: data.instance,
            submitted: data.submitted,
            approved: data.approved,
            approvedBy: data.approvedBy,
            slots: data.slots.map(itemId => itemId ? getItem(itemId) : undefined),
        }));
};