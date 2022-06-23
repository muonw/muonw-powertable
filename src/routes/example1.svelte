<script lang="ts">
import ptData from '../data/users.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>


<div class="powerTable">
    <PowerTable {ptData} />
</div>


<style lang="scss" global>
.powerTable{
    @import '../lib/styles/power-table.scss';
}
</style>