<script lang="ts">
  import { page } from "$app/stores";
  import { playerColors, trackList } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import { msToTime } from "$lib/utils";
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let chart: Chart;
  let ctx: any;

  var order = [
    "luigiCircuit",
    "peachBeach",
    "babyPark",
    "dryDryDesert",
    "mushroomBridge",
    "marioCircuit",
    "daisyCruiser",
    "waluigiStadium",
    "sherbetLand",
    "mushroomCity",
    "yoshiCircuit",
    "dkMountain",
    "warioColosseum",
    "dinoDinoJungle",
    "bowsersCastle",
    "rainbowRoad",
  ];

  const timeRecord = data.races
    .slice(0, Number($page.params.episode))
    .reduce((best, cur) => ((cur.time ?? Infinity) < (best.time ?? Infinity) ? cur : best));

  const datasets = [data.runback.topScreen, data.runback.bottomScreen].map((runback, i) => {
    let diff = 0;
    const times = order.map((track) => {
      diff += runback.times[track] - timeRecord[track];
      return diff;
    });
    return {
      label: runback.driver + " + " + runback.items,
      data: times,
      fill: false,
      backgroundColor: playerColors[runback.driver].replace("rgb", "rgba").replace(")", ",.5)"),
      borderColor: playerColors[runback.driver],
      pointStyle: false,
    };
  });

  onMount(() => {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: order.map((track) => trackList[track]),
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => msToTime(Number(value)),
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => context.dataset.label + ": " + msToTime(context.parsed.y),
            },
          },
        },
      },
    });
  });
</script>

<table class="w-full text-center">
  <thead>
    <tr>
      <th>Driver</th>
      <th>Items</th>
      <th>Kart</th>
      <th>Time</th>
      <th>Points</th>
      {#each order as track}
        <th>{trackList[track]}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{data.runback.topScreen.driver}</td>
      <td>{data.runback.topScreen.items}</td>
      <td><Kart kart={data.runback.topScreen.kart} /></td>
      <td>{msToTime(data.runback.topScreen.time)}</td>
      <td>{data.runback.topScreen.points}</td>
      {#each order as track}
        <td
          class={data.runback.topScreen.times[track] > data.runback.bottomScreen.times[track]
            ? "font-bold bg-primary/20"
            : undefined}
        >
          {msToTime(data.runback.topScreen.times[track])}
        </td>
      {/each}
    </tr>
    <tr>
      <td>{data.runback.bottomScreen.driver}</td>
      <td>{data.runback.bottomScreen.items}</td>
      <td><Kart kart={data.runback.bottomScreen.kart} /></td>
      <td>{msToTime(data.runback.bottomScreen.time)}</td>
      <td>{data.runback.bottomScreen.points}</td>
      {#each order as track}
        <td
          class={data.runback.bottomScreen.times[track] > data.runback.topScreen.times[track]
            ? "font-bold bg-primary/20"
            : undefined}
        >
          {msToTime(data.runback.bottomScreen.times[track])}
        </td>
      {/each}
    </tr>
  </tbody>
</table>
<div class="h- h-[60vh]">
  <canvas bind:this={ctx} id="chart" />
</div>
