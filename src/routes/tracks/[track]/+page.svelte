<script lang="ts">
  import { page } from "$app/stores";
  import { players, trackList, type Track } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import Team from "$lib/components/Team.svelte";
  import Winrate from "$lib/components/Winrate.svelte";
  import { msToTime } from "$lib/utils";
  import type { LayoutServerData } from "../../$types";

  export let data: LayoutServerData;
  const track = $page.params.track as Track;

  const ordered = data.races.slice().sort((a, b) => (a[track] ?? Infinity) - (b[track] ?? Infinity));

  let fastestTime = Infinity;
  const records = [];
  data.runbacks.forEach((runback) => {
    const screen =
      runback.topScreen.times[track] < runback.bottomScreen.times[track] ? runback.topScreen : runback.bottomScreen;
    if (screen.times[track] && screen.times[track] < fastestTime) {
      fastestTime = screen.times[track];
      records.unshift({ ...screen, episode: runback.episode });
    }
  });
</script>

<div class="container mx-auto">
  <div class="flex flex-row">
    <div class="flex-row w-full px-4">
      <table class="w-full text-center">
        <thead>
          <tr>
            <th />
            <th>Driver Record</th>
            <th>Items Record</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {#each players as player}
            <tr>
              <td><a href={"/players/" + player}>{player}</a></td>
              <td>
                <Winrate
                  numerator={data.stats[player].tracks[track].driverTrackWins}
                  denominator={data.stats[player].tracks[track].driverTracks}
                  units="tracks"
                />
              </td>
              <td>
                <Winrate
                  numerator={data.stats[player].tracks[track].itemTrackWins}
                  denominator={data.stats[player].tracks[track].itemTracks}
                  units="tracks"
                />
              </td>
              <td>
                <Winrate
                  numerator={data.stats[player].tracks[track].driverTrackWins +
                    data.stats[player].tracks[track].itemTrackWins}
                  denominator={data.stats[player].tracks[track].driverTracks +
                    data.stats[player].tracks[track].itemTracks}
                  units="tracks"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <img class="mx-auto" src="/assets/tracks/{trackList[track]}.png" alt={track} />
      <table class="w-full">
        <thead>
          <tr>
            <th colspan="3">Record History</th>
          </tr>
        </thead>
        <tbody>
          {#each records as record, i}
            <tr>
              <td><Team driver={record.driver} items={record.items} kart={record.kart} /></td>
              <td>
                {msToTime(record.times[track])}
                {#if i < records.length - 1}
                  ({((record.times[track] - records[i + 1].times[track]) / 1000).toFixed(3)})
                {/if}
              </td>
              <td><a href="/runbacks/{record.episode}">ep. {record.episode}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex-row w-full px-4">
      <table class="w-full">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Items</th>
            <th>Kart</th>
            <th>Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {#each ordered as record}
            <tr>
              <td>{record.driver}</td>
              <td>{record.items}</td>
              <td><Kart kart={record.kart} /></td>
              <td>{msToTime(record[track])}</td>
              <td><a href="/runbacks/{record.episode}">ep. {record.episode}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
