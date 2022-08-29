import axios from "axios";
import { Player } from "../../types";

// Softres.it payloads and responses

export interface SoftresitRaidPayload {
  allowDuplicate: boolean;
  amount: number;
  banned: number[];
  discord: boolean;
  edition: "tbc";
  faction: "Alliance";
  hideReserves: boolean;
  instance: "sunwellplateau";
  itemLimit: 0;
  plusModifier: 1;
  restrictByClass: boolean;
}

/**
 * This response is considerably larger, but we only care about these two fields.
 */
export interface SoftresitRaidResponse {
  raidId: string;
  token: string;
}

export interface SoftresitPlayerPayload {
  payload: {
    class: string;
    items: number[];
    name: string;
  };
  token: string;
}

export interface DropWithReserves {
  id: number;
  players: string[];
}

export interface PlayerWithReserves {
  player: Player;
  items: number[];
}

/**
 * Creates a raid using the softres.it api.
 * Returns the created raid payload.
 */
export const createRaid = async (): Promise<SoftresitRaidResponse> => {
  const payload: SoftresitRaidPayload = {
    allowDuplicate: true,
    amount: 10,
    banned: [],
    discord: false,
    edition: "tbc",
    faction: "Alliance",
    hideReserves: false,
    instance: "sunwellplateau",
    itemLimit: 0,
    plusModifier: 1,
    restrictByClass: false,
  };
  const data = (await axios.post(`https://softres.it/api/raid/create`, payload))
    .data as SoftresitRaidResponse;
  return data;
};

export const convertPlayerToPayload = (
  playerWithReserves: PlayerWithReserves,
  token: string
): SoftresitPlayerPayload => {
  const player = playerWithReserves.player;
  const playerClass = player.class!.toLowerCase();
  const className = playerClass.charAt(0).toUpperCase() + playerClass.slice(1);

  return {
    token,
    payload: {
      class: className,
      items: playerWithReserves.items,
      name: player.name,
    },
  };
};
