<script>
  import { goto } from "$app/navigation";
  import { players } from "$lib";
  import { IconCar, IconHelpSquare, IconRoad } from "@tabler/icons-svelte";

  const playerData = {
    Ben: {
      kart: "???",
      track: "Rainbow Road",
      item: "Big Bowser Shell",
      quote: "OH MY GOD",
      context: "on dying in a car accident",
    },
    Chris: {
      kart: "Toad Kart",
      track: "Rainbow Road",
      item: "Big Banana",
      quote: "Big Banana",
      context: "on throwing a Big Banana",
    },
    Derek: {
      kart: "Any Medium Kart",
      track: "Baby Park",
      item: "Blue Shell",
      quote: "That Piranha Plant just [redacted]",
      context: "on getting attacked by a piranha plant",
    },
    Ryan: {
      kart: "Barrel Train",
      track: "Sherbet Land",
      item: "Triple Mushroom",
      quote: "Derek",
      context: "on Derek doing anything",
    },
  };
</script>

<div class="container m-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
  {#each players as player}
    <button
      on:click={() => goto("/players/" + player)}
      class="flex p-4 rounded bg-secondary/30 hover:border hover:border-primary hover:m-[-1px]"
    >
      <div>
        <img src="/assets/icons/{player}.png" alt={player} />
        <div class="text-xl font-bold text-secondary">{player}</div>
      </div>
      <div class="ml-4 text-left flex flex-col w-full">
        <div class="flex flex-row w-full">
          <div class="flex flex-row gap-2 w-1/3"><IconCar /> {playerData[player].kart}</div>
          <div class="flex flex-row gap-2 w-1/3"><IconRoad /> {playerData[player].track}</div>
          <div class="flex flex-row gap-2 w-1/3"><IconHelpSquare /> {playerData[player].item}</div>
        </div>
        <blockquote class="mt-2">
          {playerData[player].quote}<span>{player}, {playerData[player].context}</span>
        </blockquote>
      </div>
    </button>
  {/each}
</div>

<style>
  blockquote {
    font-size: 1.4em;
    font-style: italic;
    padding: 10px 40px;
    border-left: 6px solid theme("colors.accent");
    position: relative;
  }

  blockquote::before {
    font-family: Arial;
    content: "\201C";
    font-size: 2em;
    position: absolute;
    left: 10px;
    top: -10px;
  }

  blockquote span {
    display: block;
    font-style: normal;
    margin-top: 8px;
    font-size: 12px;
  }
</style>
