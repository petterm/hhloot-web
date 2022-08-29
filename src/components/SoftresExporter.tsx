import React from "react";
import { Boss, BossDrop, Player, SoftresitPlayerPayload } from "../types";
import axios from "axios";

type SoftresExporterProps = { bosses: Boss[]; players: Player[] };

interface DropWithReserves {
  id: number;
  players: string[];
}

interface PlayerWithReserves {
  player: Player;
  items: number[];
}

const SoftresExporter = ({ bosses, players }: SoftresExporterProps) => {
  const createSoftresList = (): PlayerWithReserves[] => {
    const nonReceived = (
      reservation: BossDrop["reservations"][number]
    ): boolean => !reservation.entry.received;
    const hasReservation = (drop: BossDrop): boolean =>
      drop.reservations.filter(nonReceived).length > 0;

    const allBossDrops = bosses.map((boss) => boss.drops).flat();
    //   Produce list of drops with reserves that are not received
    const dropsWithReserves = allBossDrops.filter(hasReservation);

    // mutate the list to only extract reservations within roll range
    const dropsWithContestingReserves: DropWithReserves[] =
      dropsWithReserves.map((drop) => {
        const id = drop.item.id;
        let reserves = drop.reservations
          .filter(nonReceived)
          .sort(
            (a, b) =>
              b.entry.calcualtedScore?.total! - a.entry.calcualtedScore?.total!
          );
        const max = reserves[0].entry.calcualtedScore?.total!;
        const reservingPlayers = reserves
          .filter((res) => res.entry.calcualtedScore?.total! - max >= -3)
          .map((reserve) => reserve.playerName);

        return {
          id,
          players: reservingPlayers,
        };
      });

    // Produce list of player names that have at least one contesting reserve
    const playersWithContestingReserve = Array.from(
      new Set(dropsWithContestingReserves.map((drop) => drop.players).flat())
    );

    // Produce list of players and their reserved ids
    const playerNameWithReserves = playersWithContestingReserve.map(
      (playerName) => ({
        player: players.find((p) => p.name === playerName)!,
        items: dropsWithContestingReserves
          .filter((drop) => drop.players.includes(playerName))
          .map((drop) => drop.id),
      })
    );

    console.log(playerNameWithReserves);
    return playerNameWithReserves;
  };

  const convertPlayerToPayload = (
    playerWithReserves: PlayerWithReserves,
    token: string
  ): SoftresitPlayerPayload => {
    const player = playerWithReserves.player;
    const playerClass = player.class!.toLowerCase();
    const className =
      playerClass.charAt(0).toUpperCase() + playerClass.slice(1);

    return {
      token,
      payload: {
        class: className,
        items: playerWithReserves.items,
        name: player.name,
      },
    };
  };

  const addReservesToRaid = () => {
    const list = createSoftresList();
    // replace with id from recently created raid
    const raidId = "";
    // replace with token from recently created raid
    const token = "";
    const playerPayloads = list.map((item) =>
      convertPlayerToPayload(item, token)
    );

    // This n
    playerPayloads.forEach((payload, index) => {
      setTimeout(() => {
        const data = payload;
        axios.post(`https://softres.it/api/raid/reserve/${raidId}`, data);
      }, index * 250);
    });
  };

  return <button onClick={addReservesToRaid}>Export to softres.it</button>;
};

export default SoftresExporter;
