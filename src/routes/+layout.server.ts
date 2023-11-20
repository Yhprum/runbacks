/* eslint-disable @typescript-eslint/no-explicit-any */
import { players } from "$lib";
import prisma from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load = (async () => {
  const runbacks = await prisma.runback.findMany();

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
  // teams.forEach((team) => {
  //   stats[Object.values(team).toString()] = {
  //     teamTracks: 0,
  //     teamWins: 0,
  //   };
  // });

  runbacks.forEach((runback) => {
    if (runback.topScreen.time && runback.bottomScreen.time) {
      stats[runback.topScreen.driver].driver++;
      stats[runback.topScreen.items].items++;
      stats[runback.bottomScreen.driver].driver++;
      stats[runback.bottomScreen.items].items++;
      const winner = runback.topScreen.time < runback.bottomScreen.time ? runback.topScreen : runback.bottomScreen;
      stats[winner.driver].driverWins++;
      stats[winner.items].itemWins++;
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

      const winner =
        runback.topScreen.times[track]! < runback.bottomScreen.times[track]! ? runback.topScreen : runback.bottomScreen;
      stats[winner.driver].driverTrackWins++;
      stats[winner.items].itemTrackWins++;
      stats[winner.driver].tracks[track].driverTrackWins++;
      stats[winner.items].tracks[track].itemTrackWins++;
    });
  });

  // runbacks.length &&
  //   tracks.forEach((track) => {
  //     players.forEach((player) => {
  //       stats[player].tracks[track] = {
  //         driverWins: 0,
  //         itemWins: 0,
  //         driverGames: 0,
  //         itemGames: 0,
  //         // fastestDriver: {},
  //       };
  //     });

  //     for (let i = 0; i < records.length / 2; i++) {
  //       if (records[2 * i][track] === "") continue;
  //       stats[records[2 * i].driver].driverTracks++;
  //       stats[records[2 * i].items].itemTracks++;
  //       stats[[records[2 * i].driver, records[2 * i].items]].tracks++;
  //       stats[records[2 * i + 1].driver].driverTracks++;
  //       stats[records[2 * i + 1].items].itemTracks++;
  //       stats[[records[2 * i + 1].driver, records[2 * i + 1].items]].tracks++;

  //       stats[records[2 * i].driver][track].driverGames++;
  //       stats[records[2 * i].items][track].itemGames++;
  //       stats[records[2 * i + 1].driver][track].driverGames++;
  //       stats[records[2 * i + 1].items][track].itemGames++;

  //       let winner = records[2 * i][track] < records[2 * i + 1][track] ? 2 * i : 2 * i + 1;
  //       stats[records[winner].driver][track].driverWins++;
  //       stats[records[winner].items][track].itemWins++;
  //       stats[records[winner].driver].driverTrackWins++;
  //       stats[records[winner].items].itemTrackWins++;
  //       stats[[records[winner].driver, records[winner].items]].wins++;

  //       if (
  //         stats[records[2 * i].driver][track].fastestDriver[track] === undefined ||
  //         records[2 * i][track] < stats[records[2 * i].driver][track].fastestDriver[track]
  //       ) {
  //         stats[records[2 * i].driver][track].fastestDriver = records[2 * i];
  //       }
  //       if (
  //         stats[records[2 * i + 1].driver][track].fastestDriver[track] === undefined ||
  //         records[2 * i + 1][track] < stats[records[2 * i + 1].driver][track].fastestDriver[track]
  //       ) {
  //         stats[records[2 * i + 1].driver][track].fastestDriver = records[2 * i + 1];
  //       }
  //     }
  //     let record = runbacks
  //       .map((r) => r[track])
  //       .reduce((prev, cur) => (toMs(cur) < toMs(prev) ? cur : prev));
  //     players.forEach(
  //       (player) =>
  //         (stats[player][track].difference = subtractDuration(
  //           stats[player][track].fastestDriver[track],
  //           record,
  //         )),
  //     );
  //   });

  return { runbacks, stats };
}) satisfies LayoutServerLoad;
