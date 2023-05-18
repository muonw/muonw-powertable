<script lang="ts">
export let value: string = '';
export let rowIndex: number;
export let rowId: number;

let alternator: boolean = true;
</script>

<button class="btn lean" on:click={() => alternator = !alternator}>
    {#if alternator}
        {value} 
    {:else}
        <span style="color:green">index:</span> {rowIndex}, <span style="color:hotpink">id:</span> {rowId}
    {/if}
</button>