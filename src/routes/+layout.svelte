<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import "$lib/css/tiers.css";
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<Header isLive={data.isLive} />
<slot />
