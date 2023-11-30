<script lang="ts">
  import { playerColors, players } from "$lib";
  import { msToTime } from "$lib/utils";
  import { Chart } from "chart.js/auto";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let chart: Chart;
  let ctx: any;

  const datasets = players.map((player) => {
    let diff = 0;
    const times = data.runbacks.map((runback) => {
      const screen = [runback.topScreen, runback.bottomScreen].find(
        (screen) => screen.driver === player || screen.items === player,
      );
      return screen.driver === player ? screen.time : null;
    });
    return {
      label: player,
      data: times,
      fill: false,
      backgroundColor: playerColors[player].replace("rgb", "rgba").replace(")", ",.5)"),
      borderColor: playerColors[player],
      pointRadius: 3,
      // pointStyle: false as const,
      spanGaps: true,
    };
  });

  onMount(() => {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [...data.runbacks.map((r) => r.episode)],
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
          title: {
            display: true,
            text: "Runback Times",
          },
        },
      },
    });
  });
</script>

<svelte:head>
  <title>Graphs - Runbacks</title>
</svelte:head>

<div class="h-[60vh]">
  <canvas bind:this={ctx} id="chart" />
</div>
