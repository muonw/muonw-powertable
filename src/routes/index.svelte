<script>
let subDir = process.env.NODE_ENV === 'development' ? '' : 'powertable';
import ptData from '../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>

<br>

<h2><a href="{subDir}/examples/example1">Click here to see all examples</a></h2>

<br>

<h3>Basic Demo</h3>
<hr>
    
<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>

