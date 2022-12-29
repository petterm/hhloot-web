import Axios from "axios";
import { getInstanceData, getPlayer, prepareData } from ".";
import { Instance, Item, ItemScore, Player, PlayerName } from "../types";
import { ReservationApprovePostRequest, ReservationApprovePostResponse,
    ReservationPostRequest, ReservationPostResponse, ReservationsResponse } from "./apiTypes";
import { getItem } from "./loot";
import reservationsDevApproved from "../data/reservations_approved.json";
import reservationsDevAll from "../data/reservations_all.json";

export type ReservationsList = Partial<Record<ItemScore, Item>>;

const idOrNull = (item: Item | undefined): (number | null) => (item && item.id) || null;

export const submitReservations = async (player: Player, instance: Instance, reservations: ReservationsList) => {
    const instanceData = getInstanceData(instance);
    const data: ReservationPostRequest = {
        name: player.name,
        instance: instance,
        slots: instanceData.itemScores.map(score => idOrNull(reservations[score]))
    }

    return Axios.post<ReservationPostResponse>('/Api/reservations', data)
        .then(({ data }) => data);
};

export type AdminReservationsEntry = {
    id: number,
    player: Player | string,
    instance: Instance,
    submitted: string,
    approved?: string,
    approvedBy?: PlayerName,
    slots: (Item | undefined)[],
};

const debugData = (approved: boolean, player?: string) => {
    if (player) {
        return Promise.resolve(reservationsDevAll.filter(entry => entry.name === player) as ReservationsResponse);
    }
    if (approved) {
        return Promise.resolve(reservationsDevApproved as ReservationsResponse);
    }
    return Promise.resolve(reservationsDevAll as ReservationsResponse);
}

export const getReservations = async (
    approved: boolean,
    instance: Instance | undefined,
    playerName?: string,
    showAll?: boolean
): Promise<AdminReservationsEntry[]> => {
    const url = approved ? '/api/reservations/approved' : '/api/reservations';
    const params = {
        instance,
        player: playerName || undefined,
    };

    return (process.env.NODE_ENV === 'development' && instance === 'wotlk1' ?
        debugData(approved, playerName).then(data => ({ data })) :
        Axios.get<ReservationsResponse>(url, { params }))
            .then(({ data }) => {
                const filteredResult: AdminReservationsEntry[] = [];
                data.forEach(entry => {
                    try {
                        const player = getPlayer(entry.name);
                        filteredResult.push({
                            id: entry.id,
                            player,
                            instance: entry.instance,
                            submitted: entry.submitted,
                            approved: entry.approved,
                            approvedBy: entry.approvedBy,
                            slots: entry.slots.map(itemId => itemId ? getItem(itemId) : undefined),
                        });
                    } catch (error) {
                        console.warn('Found reservation for unknown player', entry.name);
                        if (showAll) {
                            filteredResult.push({
                                id: entry.id,
                                player: entry.name,
                                instance: entry.instance,
                                submitted: entry.submitted,
                                approved: entry.approved,
                                approvedBy: entry.approvedBy,
                                slots: entry.slots.map(itemId => itemId ? getItem(itemId) : undefined),
                            });
                        }
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
        .then(({ data: newReservations }) => {
            const player = getPlayer(newReservations.name);
            const newReservationItems = newReservations.slots.map(itemId => itemId ? getItem(itemId) : undefined);

            player.scoreSlots.forEach((playerSlot, index) => {
                const item = newReservationItems[index];
                if (item) {
                    playerSlot.item = item;
                } else {
                    playerSlot.item = undefined;
                }
            });

            prepareData();
            
            return {
                id: newReservations.id,
                player: player,
                instance: newReservations.instance,
                submitted: newReservations.submitted,
                approved: newReservations.approved,
                approvedBy: newReservations.approvedBy,
                slots: newReservationItems,
            };
        });
};


