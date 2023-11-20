<script lang="ts">
  import { players } from "$lib";
  import Winrate from "$lib/components/Winrate.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<div class="flex row">
  <div class="col">
    <h4>Stats</h4>
    <table>
      <thead>
        <tr>
          <th />
          <th>Driver Record</th>
          <th>Items Record</th>
          <th>Total Record</th>
        </tr>
      </thead>
      <tbody>
        {#each players as player}
          <tr>
            <td><a href={"/players/" + player}>{player}</a></td>
            <td>
              <Winrate
                numerator={data.stats[player].driverWins}
                denominator={data.stats[player].driver}
              />
            </td>
            <td
              ><Winrate
                numerator={data.stats[player].itemWins}
                denominator={data.stats[player].items}
              />
            </td>
            <td>
              <Winrate
                numerator={data.stats[player].driverWins + data.stats[player].itemWins}
                denominator={data.stats[player].driver + data.stats[player].items}
              />
            </td>
          </tr>
        {/each}
        <!-- {records.length ? players.map(player => {
              let driverGames = records.filter(r => r.driver === player && r.result !== "");
              let driverWins = driverGames.filter(r => r.result === "win");
              let itemGames = records.filter(r => r.items === player && r.result !== "");
              let itemWins = itemGames.filter(r => r.result === "win");
              return (
                <tr key={player}>
                  <td className="clickable" onClick={() => navigate("/players/" + player)}>{player}</td>
                  <td><Winrate numerator={driverWins.length} denominator={driverGames.length} /></td>
                  <td><Winrate numerator={itemWins.length} denominator={itemGames.length} /></td>
                  <td><Winrate numerator={driverWins.length + itemWins.length} denominator={driverGames.length + itemGames.length} /></td>
                </tr>
              );
            }) : null} -->
      </tbody>
    </table>
  </div>
  <div>
    <h3>Leaderboard</h3>
    <table>
      <thead>
        <tr>
          <th />
          <th>Driver</th>
          <th>Items</th>
          <th>Kart</th>
          <th>Time</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <!-- {records.length ? records.slice(0).sort(trackSort("time")).slice(0, 5).map((record, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{record.driver}</td>
                  <td>{record.items}</td>
                  <td><Kart kart={record.kart} /></td>
                  <td>{record.time}</td>
                  <td><Link to={`/runbacks/${record.runback}`}>ep. {record.runback}</Link></td>
                </tr>
              );
            }) : null} -->
      </tbody>
    </table>
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
