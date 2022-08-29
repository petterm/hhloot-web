import React, { useState } from "react";
import { Boss, BossDrop, Player } from "../types";
import axios from "axios";
import { convertPlayerToPayload, createRaid } from "./softres.it/utilts";

type SoftresExporterProps = { bosses: Boss[]; players: Player[] };

interface DropWithReserves {
  id: number;
  players: string[];
}

interface PlayerWithReserves {
  player: Player;
  items: number[];
}

const nonReceived = (reservation: BossDrop["reservations"][number]): boolean =>
  !reservation.entry.received;

const hasReservation = (drop: BossDrop): boolean =>
  drop.reservations.filter(nonReceived).length > 0;

const createSoftresList = (
  bosses: Boss[],
  players: Player[]
): PlayerWithReserves[] => {
  // Get all boss drops as a list
  const allBossDrops = bosses.map((boss) => boss.drops).flat();
  // Produce list of drops with reserves that are not received
  const dropsWithReserves = allBossDrops.filter(hasReservation);

  // mutate the list to only extract reservations within roll range
  const dropsWithContestingReserves: DropWithReserves[] = dropsWithReserves.map(
    (drop) => {
      const id = drop.item.id;
      let reserves = drop.reservations
        .filter(nonReceived)
        .sort(
          (a, b) =>
            b.entry.calcualtedScore?.total! - a.entry.calcualtedScore?.total!
        );
      // ToDo:
      // Before computing max we need to filter out any player that is not participating in the raid!
      // This is a key feature as the roll ranges will not respect the actual participants otherwise.
      const max = reserves[0].entry.calcualtedScore?.total!;
      const reservingPlayers = reserves
        .filter((res) => res.entry.calcualtedScore?.total! - max >= -3)
        .map((reserve) => reserve.playerName);

      return {
        id,
        players: reservingPlayers,
      };
    }
  );

  // Produce list of player names that have at least one contesting reserve
  const playersWithContestingReserve = Array.from(
    new Set(dropsWithContestingReserves.map((drop) => drop.players).flat())
  );

  // Produce list of players and their reserved ids
  const playerNameWithReserves = playersWithContestingReserve.map(
    (playerName) => ({
      player: players.find((p) => p.name === playerName)!,
      items: Array.from(
        new Set(
          dropsWithContestingReserves
            .filter((drop) => drop.players.includes(playerName))
            .map((drop) => drop.id)
        )
      ),
    })
  );

  console.log(playerNameWithReserves);
  return playerNameWithReserves;
};

const SoftresExporter = ({ bosses, players }: SoftresExporterProps) => {
  const [loading, setLoading] = useState(false);
  const [raidId, setRaidId] = useState<string>("");
  const [raidToken, setRaidToken] = useState<string>("");

  const addReservesToRaid = async () => {
    setLoading(true);
    const TTP = 400;
    const { raidId, token } = await createRaid();
    const list = createSoftresList(bosses, players);
    const playerPayloads = list.map((item) =>
      convertPlayerToPayload(item, token)
    );

    playerPayloads.forEach((payload, index) => {
      setTimeout(() => {
        const data = payload;
        axios.post(`https://softres.it/api/raid/reserve/${raidId}`, data);
      }, index * TTP);
    });

    setTimeout(() => {
      setLoading(false);
      setRaidId(raidId);
      setRaidToken(token);
    }, playerPayloads.length * TTP);
  };

  return (
    <div>
      <br></br>
      {!raidToken && !loading && (
        <button onClick={addReservesToRaid}>Export to softres.it</button>
      )}
      {loading && <h3>Creating softres - do not change or close tabs</h3>}
      {raidId && (
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://softres.it/raid/${raidId}`}
          >{`https://softres.it/raid/${raidId}`}</a>
        </p>
      )}
      {raidToken && (
        <p>
          Your token is <code>{raidToken}</code>
        </p>
      )}
    </div>
  );
};

export default SoftresExporter;
