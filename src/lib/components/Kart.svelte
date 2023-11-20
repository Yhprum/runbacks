<script lang="ts">
  import { base } from "$app/paths";

  export let kart: string;
</script>

<img src="{base}/assets/karts/{kart}.png" alt={kart} class="h-6" />
