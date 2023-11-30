<script lang="ts">
  import Kart from "$lib/components/Kart.svelte";
  import { msToTime } from "$lib/utils";
  import type { LayoutData } from "../$types";

  export let data: LayoutData;
  const tableData = data.races;

  type RunbackTd = keyof (typeof tableData)[number];

  const formatTime = (ms: number) => (ms ? msToTime(ms) : null);

  interface ColumnDef<T> {
    header: string;
    accessorKey: T;
    value?: (value: any) => any;
    element?: string;
    component?: any;
    props?: (value: any) => { [key: string]: any };
  }
  const columns: ColumnDef<RunbackTd>[] = [
    { header: "Season", accessorKey: "season" },
    {
      header: "Episode",
      accessorKey: "episode",
      element: "a",
      value: (value) => "ep. " + value,
      props: (value) => ({ href: "/runbacks/" + value }),
    },
    { header: "Driver", accessorKey: "driver" },
    { header: "Items", accessorKey: "items" },
    {
      header: "Kart",
      accessorKey: "kart",
      component: Kart,
      props: (value) => ({ kart: value }),
    },
    { header: "Result", accessorKey: "result" },
    { header: "Time", accessorKey: "time", value: (value) => formatTime(value) },
    { header: "Points", accessorKey: "points" },
    { header: "Luigi Circuit", accessorKey: "luigiCircuit", value: (value) => formatTime(value) },
    { header: "Peach Beach", accessorKey: "peachBeach", value: (value) => formatTime(value) },
    { header: "Baby Park", accessorKey: "babyPark", value: (value) => formatTime(value) },
    { header: "Dry Dry Desert", accessorKey: "dryDryDesert", value: (value) => formatTime(value) },
    { header: "Mushroom Bridge", accessorKey: "mushroomBridge", value: (value) => formatTime(value) },
    { header: "Mario Circuit", accessorKey: "marioCircuit", value: (value) => formatTime(value) },
    { header: "Daisy Cruiser", accessorKey: "daisyCruiser", value: (value) => formatTime(value) },
    { header: "Waluigi Stadium", accessorKey: "waluigiStadium", value: (value) => formatTime(value) },
    { header: "Sherbet Land", accessorKey: "sherbetLand", value: (value) => formatTime(value) },
    { header: "Mushroom City", accessorKey: "mushroomCity", value: (value) => formatTime(value) },
    { header: "Yoshi Circuit", accessorKey: "yoshiCircuit", value: (value) => formatTime(value) },
    { header: "DK Mountain", accessorKey: "dkMountain", value: (value) => formatTime(value) },
    { header: "Wario Colosseum", accessorKey: "warioColosseum", value: (value) => formatTime(value) },
    { header: "Dino Dino Jungle", accessorKey: "dinoDinoJungle", value: (value) => formatTime(value) },
    { header: "Bowser's Castle", accessorKey: "bowsersCastle", value: (value) => formatTime(value) },
    { header: "Rainbow Road", accessorKey: "rainbowRoad", value: (value) => formatTime(value) },
  ];

  let sorting: { column: keyof (typeof tableData)[number]; direction: number }[] = [];

  const setSort = (e: MouseEvent, column: RunbackTd) => {
    let sortIndex = sorting.findIndex((s) => s.column === column);
    if (sortIndex !== -1) {
      let newSort = sorting;
      if (!e.shiftKey) {
        newSort = [newSort[sortIndex]];
        sortIndex = 0;
      }
      if (newSort[sortIndex].direction === 1) {
        newSort.splice(sortIndex, 1);
      } else {
        newSort[sortIndex] = { column, direction: 1 };
      }
      sorting = newSort;
    } else {
      if (e.shiftKey) {
        sorting = [...sorting, { column, direction: -1 }];
      } else {
        sorting = [{ column, direction: -1 }];
      }
    }
  };

  const comparator = new Intl.Collator("en", { numeric: true, sensitivity: "accent" });
  $: processedData = tableData.slice().sort((a, b) => {
    let value = 0;
    sorting.some((sort) => {
      if (a[sort.column] === null && b[sort.column] === null) return false;
      if (a[sort.column] === null || b[sort.column] === null) {
        value = a[sort.column] === null ? 1 : -1;
        return true;
      }
      value = comparator.compare(String(b[sort.column]), String(a[sort.column])) * sort.direction;
      // value = (b[sort.column] - a[sort.column]) * sort.direction;
      return value !== 0;
    });
    return value;
  });
</script>

<svelte:head>
  <title>Runbacks</title>
</svelte:head>

<div class="h-[calc(100vh-50px)] overflow-auto">
  <table class:unsorted={sorting.length === 0}>
    <thead>
      <tr>
        {#each columns as column}
          <th
            class:sort-asc={sorting.find((s) => s.column === column.accessorKey)?.direction === -1}
            class:sort-desc={sorting.find((s) => s.column === column.accessorKey)?.direction === 1}
            on:click={(e) => setSort(e, column.accessorKey)}
          >
            {column.header}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each processedData as row}
        <tr>
          {#each columns as column}
            <td>
              {#if column.component}
                <svelte:component this={column.component} {...column.props?.(row[column.accessorKey])} />
              {:else if column.element}
                <svelte:element this={column.element} {...column.props?.(row[column.accessorKey])}>
                  {column.value ? column.value(row[column.accessorKey]) : row[column.accessorKey]}
                </svelte:element>
              {:else}
                {column.value ? column.value(row[column.accessorKey]) : row[column.accessorKey]}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table > thead {
    position: sticky;
    top: 0;
    background-color: theme("colors.background");
    user-select: none;
  }

  table.unsorted > tbody > tr:nth-of-type(4n + 1),
  table.unsorted > tbody > tr:nth-of-type(4n + 2) {
    background-color: theme("colors.text/0.1");
  }

  table:not(.unsorted) > tbody > tr:nth-of-type(2n + 1) {
    background-color: theme("colors.text/0.1");
  }

  table th {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sort-asc {
    box-shadow: inset 0 2px 0 0 theme("colors.accent");
  }

  .sort-desc {
    box-shadow: inset 0 -2px 0 0 theme("colors.accent");
  }
</style>
