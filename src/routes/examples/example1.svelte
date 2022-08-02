<script lang="ts">
import ptData from '../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>

<div class="MuonW PowerTable">
    <PowerTable {ptData}  />
</div>
