/* eslint-disable @typescript-eslint/no-explicit-any */
import { players, teams } from "$lib";
import pb from "$lib/db";
import type { Runback } from "$lib/types";
import type { LayoutLoad } from "./$types";

export const load = (async () => {
  const runbacks = await pb.collection("Runbacks").getFullList<Runback>();

  const races = runbacks
    .map((runback) => {
      let winner: number;
      if (runback.topScreen.points && runback.bottomScreen.points) {
        winner = runback.topScreen.points > runback.bottomScreen.points ? 0 : 1;
      }
      return [runback.topScreen, runback.bottomScreen].map((screen, i) => ({
        driver: screen.driver,
        items: screen.items,
        kart: screen.kart,
        result: winner !== undefined ? (winner === i ? "win" : "lose") : null,
        time: screen.time,
        points: screen.points,
        ...screen.times,
        episode: runback.episode,
        season: runback.season,
        link: runback.link,
      }));
    })
    .flat();

  const stats: any = {};

  players.forEach((player) => {
    stats[player] = {
      driver: 0,
      items: 0,
      driverWins: 0,
      itemWins: 0,
      driverTracks: 0,
      itemTracks: 0,
      driverTrackWins: 0,
      itemTrackWins: 0,
      tracks: Object.keys(runbacks[0].topScreen.times).reduce((result, key) => {
        result[key] = {
          driverTracks: 0,
          itemTracks: 0,
          driverTrackWins: 0,
          itemTrackWins: 0,
        };
        return result;
      }, {} as any),
    };
  });
  teams.forEach((team) => {
    stats[Object.values(team).toString()] = {
      teamGames: 0,
      teamGameWins: 0,
      teamTracks: 0,
      teamTrackWins: 0,
    };
  });

  runbacks.forEach((runback) => {
    if (runback.topScreen.points && runback.bottomScreen.points) {
      stats[runback.topScreen.driver].driver++;
      stats[runback.topScreen.items].items++;
      stats[runback.bottomScreen.driver].driver++;
      stats[runback.bottomScreen.items].items++;

      stats[[runback.topScreen.driver, runback.topScreen.items].toString()].teamGames++;
      stats[[runback.bottomScreen.driver, runback.bottomScreen.items].toString()].teamGames++;

      const winner = runback.topScreen.points > runback.bottomScreen.points ? runback.topScreen : runback.bottomScreen;
      stats[winner.driver].driverWins++;
      stats[winner.items].itemWins++;
      stats[[winner.driver, winner.items].toString()].teamGameWins++;
    }

    type TrackKeys = Array<keyof typeof runback.topScreen.times>;
    (Object.keys(runback.topScreen.times) as TrackKeys).forEach((track) => {
      if (!runback.topScreen.times[track] || !runback.bottomScreen.times[track]) return;
      stats[runback.topScreen.driver].driverTracks++;
      stats[runback.topScreen.items].itemTracks++;
      stats[runback.bottomScreen.driver].driverTracks++;
      stats[runback.bottomScreen.items].itemTracks++;

      stats[runback.topScreen.driver].tracks[track].driverTracks++;
      stats[runback.topScreen.items].tracks[track].itemTracks++;
      stats[runback.bottomScreen.driver].tracks[track].driverTracks++;
      stats[runback.bottomScreen.items].tracks[track].itemTracks++;

      stats[[runback.topScreen.driver, runback.topScreen.items].toString()].teamTracks++;
      stats[[runback.bottomScreen.driver, runback.bottomScreen.items].toString()].teamTracks++;

      const winner =
        runback.topScreen.times[track]! < runback.bottomScreen.times[track]! ? runback.topScreen : runback.bottomScreen;
      stats[winner.driver].driverTrackWins++;
      stats[winner.items].itemTrackWins++;
      stats[winner.driver].tracks[track].driverTrackWins++;
      stats[winner.items].tracks[track].itemTrackWins++;
      stats[[winner.driver, winner.items].toString()].teamTrackWins++;
    });
  });

  return { runbacks, stats, races };
}) satisfies LayoutLoad;
