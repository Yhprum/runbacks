<script lang="ts">
  import { playerColors, trackList } from "$lib";
  import Kart from "$lib/components/Kart.svelte";
  import TrackTime from "$lib/components/TrackTime.svelte";
  import pb from "$lib/db";
  import type { Live } from "$lib/types";
  import { msToTime } from "$lib/utils";
  import Chart, { type ChartDataset, type ChartItem } from "chart.js/auto";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const timeRecord = data.races.reduce((best, cur) => ((cur.time ?? Infinity) < (best.time ?? Infinity) ? cur : best));

  const trackTimes = Object.fromEntries(
    Object.keys(trackList).map((track) => [track, data.races.map((race) => race[track])]),
  );

  let liveData: Live;
  let chart: Chart;
  let ctx: ChartItem;

  onMount(() => {
    pb.collection("Live")
      .getFirstListItem<Live>("")
      .then((record) => {
        liveData = record;
        const chartContext = makeChart(ctx, record);
        pb.collection("Live").subscribe<Live>(record.id, (e) => {
          console.log(e.action);
          console.log(e.record);
          liveData = e.record;
          chartContext.update(e.record);
        });
      });

    return () => pb.collection("Live").unsubscribe();
  });

  function calculateDiffs(times: number[], trackOrder: string[]) {
    let diff = 0;
    return trackOrder.map((track, i) => {
      diff += times[i] - timeRecord[track];
      return diff;
    });
  }

  function makeChart(ctx, d: Live) {
    if (!d) return;
    const datasets: ChartDataset<"line", number[]>[] = [d.topScreen, d.bottomScreen].map((runback, i) => ({
      label: runback.driver + " + " + runback.items,
      data: calculateDiffs([d.topScreenTimes, d.bottomScreenTimes][i], d.trackOrder),
      fill: false,
      backgroundColor: playerColors[runback.driver].replace("rgb", "rgba").replace(")", ",.5)"),
      borderColor: playerColors[runback.driver],
      pointStyle: false as const,
    }));
    datasets.push({
      label: `${timeRecord.driver} + ${timeRecord.items} (ep. ${timeRecord.episode})`,
      data: Array(16).fill(0),
      borderColor: "#ffe565",
      borderWidth: 2,
      pointStyle: false as const,
    });
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: d.trackOrder.map((track) => trackList[track]),
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
    return {
      update(updated: Live) {
        chart.data.labels = updated.trackOrder.map((track) => trackList[track]);
        chart.data.datasets[0].data = calculateDiffs(updated.topScreenTimes, updated.trackOrder);
        chart.data.datasets[1].data = calculateDiffs(updated.bottomScreenTimes, updated.trackOrder);
        chart.update();
      },
      destroy() {
        chart.destroy();
      },
    };
  }
</script>

<svelte:head>
  <title>Live - Runbacks</title>
</svelte:head>

{#if liveData}
  <table class="w-full text-center">
    <thead>
      <tr>
        <th>Driver</th>
        <th>Items</th>
        <th>Kart</th>
        <th>Time</th>
        <th>Points</th>
        {#each liveData.trackOrder as track}
          <th>{trackList[track]}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{liveData.topScreen.driver}</td>
        <td>{liveData.topScreen.items}</td>
        <td><Kart kart={liveData.topScreen.kart} /></td>
        <td>{msToTime(liveData.topScreenTimes.reduce((a, b) => a + b, 0))}</td>
        <td>{liveData.topScreenPoints}</td>
        {#each liveData.topScreenTimes as time, i}
          <TrackTime
            {time}
            win={time < liveData.bottomScreenTimes[i]}
            trackTimes={trackTimes[liveData.trackOrder[i]]}
          />
        {/each}
      </tr>
      <tr>
        <td>{liveData.bottomScreen.driver}</td>
        <td>{liveData.bottomScreen.items}</td>
        <td><Kart kart={liveData.bottomScreen.kart} /></td>
        <td>{msToTime(liveData.bottomScreenTimes.reduce((a, b) => a + b, 0))}</td>
        <td>{liveData.bottomScreenPoints}</td>
        {#each liveData.bottomScreenTimes as time, i}
          <TrackTime {time} win={time < liveData.topScreenTimes[i]} trackTimes={trackTimes[liveData.trackOrder[i]]} />
        {/each}
      </tr>
    </tbody>
  </table>
{/if}
<div class="h-[60vh]">
  <canvas bind:this={ctx} id="chart" />
</div>
