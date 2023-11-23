<script lang="ts">
  import { IconHelpSquare, IconSteeringWheel } from "@tabler/icons-svelte";
  import Kart from "./Kart.svelte";

  export let driver: string;
  export let items: string;
  export let kart: string;
</script>

<div class="flex flex-row items-center">
  <Kart {kart} height="h-10" />
  <div class="flex flex-col ml-2">
    <div class="flex flex-row items-center">
      <div class="icon"><IconSteeringWheel size={14} /></div>
      {driver}
    </div>
    <div class="flex flex-row items-center">
      <div class="icon"><IconHelpSquare size={14} /></div>
      {items}
    </div>
  </div>
</div>

<style>
  .icon {
    height: 12px;
    color: theme("colors.accent");
    margin-right: 4px;
  }
</style>
