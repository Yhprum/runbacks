<script lang="ts">
  import Kart from "$lib/components/Kart.svelte";
  import { kartStats, kartTiers } from "./karts";

  const type = "ranks";
  const data = kartStats;

  const tier = (kart, stat) =>
    "tier-cell tier-" + ["d", "c", "b", "a", "s"][kartTiers[stat].findIndex((tier) => tier.includes(kart.ranks[stat]))];
</script>

<svelte:head>
  <title>Karts - Runbacks</title>
</svelte:head>

<div class="container mx-auto">
  <table class="w-full mb-4">
    <thead class="text-center">
      <tr>
        <th />
        <th class="text-left">Kart</th>
        <th>Top Speed</th>
        <th>Acceleration</th>
        <th>Off-Road</th>
        <th>Weight</th>
        <th>Width</th>
        <th>Bounciness</th>
        <th>Mini-Turbo</th>
      </tr>
    </thead>
    <tbody>
      {#each data as kart}
        <tr>
          <td><Kart kart={kart.name} /></td>
          <td>{kart.name}</td>
          <td class={tier(kart, "topSpeed")}>{kart[type].topSpeed}</td>
          <td class={tier(kart, "acceleration")}>{kart[type].acceleration}</td>
          <td class={tier(kart, "offRoad")}>{kart[type].offRoad}</td>
          <td class={tier(kart, "weight")}>{kart[type].weight}</td>
          <td class={tier(kart, "width")}>{kart[type].width}</td>
          <td class={tier(kart, "bounciness")}>{kart[type].bounciness}</td>
          <td class={tier(kart, "miniTurbo")}>{kart[type].miniTurbo}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
