<script lang="ts">
  export let numerator: number;
  export let denominator: number;

  export let units = "games";
</script>

<div>
  <div class="winrate">{((numerator / denominator) * 100).toFixed(0)}%</div>
  <div class="light">{denominator} {units}</div>
</div>

<style>
  .winrate {
    font-size: 20pt;
    font-weight: bold;
  }

  .light {
    font-size: 10pt;
    color: grey;
  }
</style>
