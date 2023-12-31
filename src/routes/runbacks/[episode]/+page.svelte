<script lang="ts">
  import { page } from "$app/stores";
  import { playerColors, trackList } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import TrackTime from "$lib/components/TrackTime.svelte";
  import { msToTime } from "$lib/utils";
  import Chart, { type ChartConfiguration, type ChartDataset, type ChartItem } from "chart.js/auto";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let chart: Chart;
  let ctx: ChartItem;

  const pastRaces = data.races.slice(0, Math.max(Number($page.params.episode) - 1, 1) * 2);

  const timeRecord = pastRaces.reduce((best, cur) => ((cur.time ?? Infinity) < (best.time ?? Infinity) ? cur : best));

  const datasets: ChartDataset<"line", number[]>[] = [data.runback.topScreen, data.runback.bottomScreen].map(
    (runback) => {
      let diff = 0;
      const times = data.runback.trackOrder.map((track) => {
        diff += runback.times[track] - timeRecord[track];
        return diff;
      });
      return {
        label: runback.driver + " + " + runback.items,
        data: times,
        fill: false,
        backgroundColor: playerColors[runback.driver].replace("rgb", "rgba").replace(")", ",.5)"),
        borderColor: playerColors[runback.driver],
        pointStyle: false as const,
      };
    },
  );

  datasets.push({
    label: `${timeRecord.driver} + ${timeRecord.items} (ep. ${timeRecord.episode})`,
    data: Array(16).fill(0),
    borderColor: "rgb(255, 229, 101)",
    borderWidth: 2,
    pointStyle: false as const,
  });

  const config: ChartConfiguration<"line", number[], any> = {
    type: "line",
    data: {
      labels: data.runback.trackOrder.map((track) => trackList[track]),
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
  };

  onMount(() => {
    console.log("Mount");
    chart = new Chart(ctx, config);
  });

  const description = `${data.runback.topScreen.driver} + ${data.runback.topScreen.items} (${data.runback.topScreen.kart}) vs. ${data.runback.bottomScreen.driver} + ${data.runback.bottomScreen.items} (${data.runback.topScreen.kart})`;
</script>

<svelte:head>
  <title>ep. {$page.params.episode} - Runbacks</title>
  <meta name="description" content={description}>

  <meta property="og:title" content="Runback episode {$page.params.episode}" />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://runbacks.yhprum.com/runbacks/{$page.params.episode}" />
  <meta
    property="og:image"
    content={`https://quickchart.io/chart?c=${JSON.stringify({ type: config.type, data: config.data })}`}
  />
  <meta name="twitter:card" content="summary_large_image">
</svelte:head>

<table class="w-full text-center">
  <thead>
    <tr>
      <th>Driver</th>
      <th>Items</th>
      <th>Kart</th>
      <th>Time</th>
      <th>Points</th>
      {#each data.runback.trackOrder as track}
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
      {#each data.runback.trackOrder as track}
        <TrackTime
          time={data.runback.topScreen.times[track]}
          win={data.runback.topScreen.times[track] < data.runback.bottomScreen.times[track]}
          trackTimes={pastRaces.map((race) => race[track])}
        />
      {/each}
    </tr>
    <tr>
      <td>{data.runback.bottomScreen.driver}</td>
      <td>{data.runback.bottomScreen.items}</td>
      <td><Kart kart={data.runback.bottomScreen.kart} /></td>
      <td>{msToTime(data.runback.bottomScreen.time)}</td>
      <td>{data.runback.bottomScreen.points}</td>
      {#each data.runback.trackOrder as track}
        <TrackTime
          time={data.runback.bottomScreen.times[track]}
          win={data.runback.bottomScreen.times[track] < data.runback.topScreen.times[track]}
          trackTimes={pastRaces.map((race) => race[track])}
        />
      {/each}
    </tr>
  </tbody>
</table>
<div class="h-[60vh]">
  <canvas bind:this={ctx} id="chart" />
</div>
