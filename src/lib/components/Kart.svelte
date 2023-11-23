<script lang="ts">
  import { base } from "$app/paths";

  export let kart: string;
  export let height = "h-6";
</script>

<img src="{base}/assets/karts/{kart}.png" alt={kart} class={height} />
