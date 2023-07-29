<script lang="ts">
export let value: string = '';
export let rowIndex: number;
export let rowId: number;
export let instructKey: string;

let alternator: boolean = true;
</script>

<button class="btn lean" on:click={() => alternator = !alternator}>
    {#if alternator}
        {value} 
    {:else}
        <span style="color:green">index:</span> {rowIndex}, <span style="color:hotpink">id:</span> {rowId}, <span style="color:#ea9802">key:</span> {instructKey}
    {/if}
</button>