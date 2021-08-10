import Axios from "axios";
import { getPlayer, prepareData } from ".";
import { itemScoresAq40, itemScoresNaxx, itemScoresTBC1, scoreGroupEdgesAq40, scoreGroupEdgesNaxx, scoreGroupEdgesTBC1 } from "../constants";
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
        slots: getItemScores(instance).map(score => idOrNull(reservations[score]))
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

    return Axios.get<ReservationsResponse>(url, { params })
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

export const getItemScores = (instance: Instance): ItemScore[] => {
    if (instance === 'aq40') {
        return itemScoresAq40;
    }
    if (instance === 'naxx') {
        return itemScoresNaxx;
    }
    if (instance === 'tbc1') {
        return itemScoresTBC1;
    }
    throw Error(`Unknown instance ${instance}`);
};

export const getScoreGroupEdges = (instance: Instance): ItemScore[] => {
    if (instance === 'aq40') {
        return scoreGroupEdgesAq40;
    }
    if (instance === 'naxx') {
        return scoreGroupEdgesNaxx;
    }
    if (instance === 'tbc1') {
        return scoreGroupEdgesTBC1;
    }
    throw Error(`Unknown instance ${instance}`);
};
