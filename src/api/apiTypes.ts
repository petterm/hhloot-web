import { Class, GuildRank, Instance, PlayerName } from "../types";

type Slot = number | null;

export type ReservationsResponse = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    approved?: string,
    approvedBy?: PlayerName,
    slots: Slot[],
}[];

export type ReservationPostRequest = {
    name: PlayerName,
    instance: Instance,
    slots: Slot[],
}

export type ReservationPostResponse = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    slots: Slot[],
}

export type ReservationApprovePostRequest = {
    id: number,
    approver: PlayerName,
}

export type ReservationApprovePostResponse = {
    id: number,
    name: PlayerName,
    instance: Instance,
    submitted: string,
    approved: string,
    approvedBy: PlayerName,
    slots: Slot[],
}

export type PlayersResponseRaid = {
    instance: string,
    date: string,
    attendance: number,
};

export type PlayersResponse = {
    name: string,
    class: Class,
    guildRank: GuildRank,
    raidAttendance: PlayersResponseRaid[],
}[];

export type LoginStatusResponse = {
    authenticated: boolean,
    character?: PlayerName,
};
