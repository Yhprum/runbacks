<script lang="ts">
  import { players } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import Winrate from "$lib/components/Winrate.svelte";
  import { msToTime } from "$lib/utils";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  const topTimes = data.races
    .flat()
    .sort((a, b) => (a.time ?? Infinity) - (b.time ?? Infinity))
    .slice(0, 5);
</script>

<svelte:head>
  <title>Runbacks</title>
</svelte:head>

<div class="container mx-auto">
  <div class="flex flex-row">
    <div class="flex-col w-full px-4">
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
                <Winrate numerator={data.stats[player].driverWins} denominator={data.stats[player].driver} />
              </td>
              <td>
                <Winrate numerator={data.stats[player].itemWins} denominator={data.stats[player].items} />
              </td>
              <td>
                <Winrate
                  numerator={data.stats[player].driverWins + data.stats[player].itemWins}
                  denominator={data.stats[player].driver + data.stats[player].items}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="flex-col w-full px-4">
      <table class="w-full">
        <thead>
          <tr>
            <th />
            <th>Driver</th>
            <th>Items</th>
            <th>Kart</th>
            <th>Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {#each topTimes as runback, i}
            <tr>
              <td>{i + 1}</td>
              <td>{runback.driver}</td>
              <td>{runback.items}</td>
              <td><Kart kart={runback.kart} /></td>
              <td>{msToTime(runback.time)}</td>
              <td><a href={`/runbacks/${runback.episode}`}>ep. {runback.episode}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
