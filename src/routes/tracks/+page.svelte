<script lang="ts">
  import { players, trackList, tracks } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import Winrate from "$lib/components/Winrate.svelte";
  import { msToTime } from "$lib/utils";
  import type { LayoutServerData } from "../$types";

  export let data: LayoutServerData;
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
                  numerator={data.stats[player].driverTrackWins}
                  denominator={data.stats[player].driverTracks}
                  units="tracks"
                />
              </td>
              <td>
                <Winrate
                  numerator={data.stats[player].itemTrackWins}
                  denominator={data.stats[player].itemTracks}
                  units="tracks"
                />
              </td>
              <td>
                <Winrate
                  numerator={data.stats[player].driverTrackWins + data.stats[player].itemTrackWins}
                  denominator={data.stats[player].driverTracks + data.stats[player].itemTracks}
                  units="tracks"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <img class="mx-auto" src="/assets/cups/all.png" alt="All Cup" />
      <table class="w-full">
        <thead>
          <tr>
            <th colspan="3">Recent Records</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kart+Driver+Items</td>
            <td>1:23.456 (-.002)</td>
            <td>11/21/2023</td>
            <td>ep.100</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex-row w-full px-4">
      <table class="w-full">
        <thead>
          <tr>
            <th>Track</th>
            <th>Driver</th>
            <th>Items</th>
            <th>Kart</th>
            <th>Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {#each tracks as track}
            {@const record = data.races.slice().sort((a, b) => (a[track] ?? Infinity) - (b[track] ?? Infinity))[0]}
            <tr>
              <td><a href="tracks/{track}">{trackList[track]}</a></td>
              <td>{record.driver}</td>
              <td>{record.items}</td>
              <td><Kart kart={record.kart} /></td>
              <td>{msToTime(record[track])}</td>
              <td><a href="runbacks/{record.episode}">ep. {record.episode}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
