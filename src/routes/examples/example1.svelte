<script lang="ts">
import ptData from '../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>

<style lang="scss">
@import '../../../node_modules/@muonw/mascara/src/lib/styles/main.scss';
@import '../../lib/styles/power-table.scss';

tr[data-name=filters-tr] {
    input{
        @extend .compact;
    }
}
div[data-name=search-container]{
    input[data-name=search-input]{
        @extend .medium;
    }
}
</style>