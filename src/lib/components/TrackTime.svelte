<script lang="ts">
  import { msToTime } from "$lib/utils";

  export let time: number;
  export let win: boolean;
  export let trackTimes: any[];

  const cutoff =
    trackTimes.length <= 2
      ? 0
      : trackTimes.length <= 4
        ? 1
        : trackTimes.length <= 10
          ? 3
          : trackTimes.length <= 25
            ? 5
            : trackTimes.length < 50
              ? 7
              : 10;

  const placing = trackTimes.filter((trackTime) => trackTime < time).length + (win ? 1 : 2);

  const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
  const suffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  function ordinal(number: number) {
    const category = ordinalRules.select(number);
    const suffix = suffixes[category];
    return number + suffix;
  }
</script>

<td class="relative" class:win class:record={placing === 1}>
  {msToTime(time)}
  {#if placing <= cutoff}
    <span class="absolute top-0 right-[2px] text-xs">{ordinal(placing)}</span>
  {/if}
</td>

<style>
  .win.record {
    border: 3px solid theme("colors.text");
  }
  .win {
    font-weight: 700;
    background-color: theme("colors.accent" / 0.3);
  }
</style>
