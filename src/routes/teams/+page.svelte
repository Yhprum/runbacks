<script lang="ts">
  import { percent, teams, trackList, type Track } from "$lib";
  import { msToTime } from "$lib/utils";
  import type { LayoutData } from "../$types";

  export let data: LayoutData;

  let teamRecords: any = {};
  let trackRecords = Object.keys(trackList).map((track: Track) =>
    data.races.reduce((prev, cur) => ((cur[track] ?? Infinity) < (prev[track] ?? Infinity) ? cur : prev)),
  );

  teams.forEach((team) => {
    let games = data.races.filter(
      (record) => record.driver === team.driver && record.items === team.items && record.result !== null,
    );
    teamRecords[Object.values(team).toString()] = {
      games: games.length,
      wins: games.reduce((sum, record) => sum + (record.result === "win" ? 1 : 0), 0),
      fastest: games.length
        ? games.reduce((fastest, cur) => ((cur.time ?? Infinity) < (fastest.time ?? Infinity) ? cur : fastest))
        : 0,
      records: trackRecords.reduce(
        (sum, record) => sum + (record.driver === team.driver && record.items === team.items ? 1 : 0),
        0,
      ),
    };
  });
  teams.sort(
    (a, b) =>
      data.stats[Object.values(b).toString()].teamGameWins / data.stats[Object.values(b).toString()].teamGames -
      data.stats[Object.values(a).toString()].teamGameWins / data.stats[Object.values(a).toString()].teamGames,
  );
</script>

<div class="container mx-auto">
  <table class="w-full text-center">
    <thead>
      <tr>
        <th>Driver</th>
        <th>Items</th>
        <th>Occurrences</th>
        <th>Fastest Time</th>
        <th>Number of Records</th>
        <th>Runbacks</th>
        <th>Tracks</th>
      </tr>
    </thead>
    <tbody>
      {#each teams as team}
        <tr>
          <td>{team.driver}</td>
          <td>{team.items}</td>
          <td>{teamRecords[Object.values(team).toString()].games}</td>
          <td>{msToTime(teamRecords[Object.values(team).toString()].fastest.time)}</td>
          <td>{teamRecords[Object.values(team).toString()].records}</td>
          <td>
            {percent(
              data.stats[Object.values(team).toString()].teamGameWins /
                data.stats[Object.values(team).toString()].teamGames,
            )}
          </td>
          <td>
            {percent(
              data.stats[Object.values(team).toString()].teamTrackWins /
                data.stats[Object.values(team).toString()].teamTracks,
            )}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
