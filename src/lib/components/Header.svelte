<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav>
  <div class="container mx-auto">
    <ul>
      <li>
        <a href="/">
          <span class="font-bold text-4xl bg-gradient-to-br from-primary to-accent gradient">Runbacks</span>
        </a>
      </li>
      <li><a href="/runbacks" class:underline={$page.url.pathname === "/runbacks"}>Runback List</a></li>
      <li><a href="/players" class:underline={$page.url.pathname === "/players"}>Players</a></li>
      <li><a href="/teams" class:underline={$page.url.pathname === "/teams"}>Teams</a></li>
      <li><a href="/tracks" class:underline={$page.url.pathname === "/tracks"}>Tracks</a></li>
      <li><a href="/karts" class:underline={$page.url.pathname === "/karts"}>Karts</a></li>
      <li><a href="/graphs" class:underline={$page.url.pathname === "/graphs"}>Graphs</a></li>
    </ul>
  </div>
</nav>

<style>
  ul li {
    display: inline;
    padding-right: 1rem;
  }

  nav {
    height: 50px;
    border-bottom: 1px solid var(--border-color);
  }

  .gradient {
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
