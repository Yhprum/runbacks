<script lang="ts">
  import Kart from "$lib/components/Kart.svelte";
  import { msToTime } from "$lib/utils";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<table class="w-full text-center">
  <thead>
    <tr>
      <th>Driver</th>
      <th>Items</th>
      <th>Kart</th>
      <th>Time</th>
      <th>Points</th>
      {#each data.runback.trackOrder as track}
        <th>{track}</th>
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
    </tr>
    <tr>
      <td>{data.runback.bottomScreen.driver}</td>
      <td>{data.runback.bottomScreen.items}</td>
      <td><Kart kart={data.runback.bottomScreen.kart} /></td>
      <td>{msToTime(data.runback.bottomScreen.time)}</td>
      <td>{data.runback.bottomScreen.points}</td>
    </tr>
  </tbody>
</table>
