<script lang="ts">
  // import type { PageData } from "./$types";

  // export let data: PageData;
</script>

<div class="container">
  <div class="flex row">
    <div class="col">
      <h4>Track Stats</h4>
      <table>
        <thead>
          <tr>
            <th />
            <th>Driver Record</th>
            <th>Items Record</th>
            <th>Total Record</th>
          </tr>
        </thead>
        <tbody> </tbody>
      </table>
    </div>
    <div class="col">
      <h4>Track Records</h4>
      <table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Driver</th>
            <th>Items</th>
            <th>Kart</th>
            <th>Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody> </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .row {
    flex-direction: row;
  }
  .col {
    flex-direction: col;
  }
</style>
