<script lang="ts">
  import { players, trackList, tracks } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import Team from "$lib/components/Team.svelte";
  import Winrate from "$lib/components/Winrate.svelte";
  import { msToTime } from "$lib/utils";
  import { IconChevronLeft, IconChevronRight } from "@tabler/icons-svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  const allRecords = Object.values(data.trackRecords)
    .toReversed()
    .map((records) => records.map((record, i) => ({ ...record, i })))
    .flat()
    .sort((a, b) => b.episode - a.episode);

  let page = 0;
  $: records = allRecords.slice(5 * page, 5 * (page + 1));
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
      <table class="w-full">
        <thead>
          <tr class="align-bottom">
            <th>Recent Records</th>
            <th>
              <img src="/assets/cups/all.png" alt="All Cup" />
            </th>
            {#if allRecords.length > 5}
              <th>
                <div class="flex flex-row items-end">
                  <button disabled={page === 0} on:click={() => page--}>
                    <IconChevronLeft size={20} />
                  </button>
                  {page + 1}
                  <button disabled={page === Math.ceil(allRecords.length / 5 - 1)} on:click={() => page++}>
                    <IconChevronRight size={20} />
                  </button>
                </div>
              </th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each records as record}
            <tr>
              <td><Team driver={record.driver} items={record.items} kart={record.kart} /></td>
              <td class="flex flex-col">
                <div><a href="/tracks/{record.track}">{trackList[record.track]}</a></div>
                {msToTime(record.times[record.track])}
                {#if record.i < data.trackRecords[record.track].length - 1}
                  ({(
                    (record.times[record.track] - data.trackRecords[record.track][record.i + 1].times[record.track]) /
                    1000
                  ).toFixed(3)})
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

<style>
  button[disabled] {
    opacity: 0;
  }
</style>
