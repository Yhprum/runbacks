<script lang="ts">
  import { page } from "$app/stores";
  import { percent, trackList } from "$lib";
  import Winrate from "$lib/components/Winrate.svelte";
  import { msToTime } from "$lib/utils";
  import type { LayoutData } from "../../$types";

  export let data: LayoutData;

  const player = $page.params.player;
  const stats = data.stats[player];

  const driverGames = data.races.filter((record) => record.driver === player && record.result !== "");
  const driver = driverGames.reduce((sum, record) => sum + (record.result === "win" ? 1 : 0), 0);
  const itemsGames = data.races.filter((record) => record.items === player && record.result !== "");
  const items = itemsGames.reduce((sum, record) => sum + (record.result === "win" ? 1 : 0), 0);

  const records = Object.keys(trackList).map((track) =>
    data.races.reduce((prev, cur) => (cur[track] && cur[track] < prev ? cur[track] : prev), Infinity),
  );
  const bests = Object.keys(trackList).map((track) =>
    driverGames.reduce((prev, cur) => (cur[track] && cur[track] < prev ? cur[track] : prev), Infinity),
  );
</script>

<div class="container mx-auto">
  <div class="flex flex-row">
    <div class="flex-col px-4 w-1/4">
      <table class="w-full text-center">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Winrate numerator={driver} denominator={driverGames.length} /></td>
            <td><Winrate numerator={items} denominator={itemsGames.length} /></td>
            <td><Winrate numerator={driver + items} denominator={driverGames.length + itemsGames.length} /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex-col w-full px-4">
      <table class="w-full">
        <thead>
          <tr>
            <th>Track</th>
            <th>Fastest Time</th>
            <th>vs. Record</th>
            <th>Winrate (Driver)</th>
            <th>Winrate (Items)</th>
            <th>Overall</th>
          </tr>
        </thead>
        <tbody>
          {#each Object.keys(trackList) as track, i}
            <tr>
              <td><a href="/tracks/{track}">{trackList[track]}</a></td>
              <td class={records[i] === bests[i] ? "font-bold text-primary" : undefined}>
                {msToTime(bests[i])}
              </td>
              <td>{records[i] === bests[i] ? "-" : "+" + ((bests[i] - records[i]) / 1000).toFixed(3)}</td>
              <td>{percent(stats.tracks[track].driverTrackWins / stats.tracks[track].driverTracks)}</td>
              <td>{percent(stats.tracks[track].itemTrackWins / stats.tracks[track].itemTracks)}</td>
              <td>
                {(
                  ((stats.tracks[track].driverTrackWins + stats.tracks[track].itemTrackWins) /
                    (stats.tracks[track].driverTracks + stats.tracks[track].itemTracks)) *
                  100
                ).toFixed(0)}%
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot class="text-accent">
          <tr>
            <td>Totals</td>
            <td>
              {msToTime(bests.reduce((a, b) => a + b, 0))}
            </td>
            <td>+{((bests.reduce((a, b) => a + b, 0) - records.reduce((a, b) => a + b, 0)) / 1000).toFixed(3)}</td>
            <td>{percent(stats.driverTrackWins / stats.driverTracks)}</td>
            <td>{percent(stats.itemTrackWins / stats.itemTracks)}</td>
            <td>{percent((stats.driverTrackWins + stats.itemTrackWins) / (stats.driverTracks + stats.itemTracks))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</div>
