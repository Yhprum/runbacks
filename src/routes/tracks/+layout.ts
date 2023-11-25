import { trackList } from "$lib";
import type { LayoutLoad } from "./$types";

export const load = (async ({ parent }) => {
  const { runbacks } = await parent();

  const fastestTimes = Object.fromEntries(Object.keys(trackList).map((track) => [track, Infinity]));
  const trackRecords = Object.fromEntries(Object.keys(trackList).map((track) => [track, []]));
  runbacks.forEach((runback) => {
    Object.keys(trackList).forEach((track) => {
      const screen =
        runback.topScreen.times[track] < runback.bottomScreen.times[track] ? runback.topScreen : runback.bottomScreen;
      if (screen.times[track] && screen.times[track] < fastestTimes[track]) {
        fastestTimes[track] = screen.times[track];
        trackRecords[track].unshift({ ...screen, track, episode: runback.episode });
      }
    });
  });
  return { trackRecords };
}) satisfies LayoutLoad;
