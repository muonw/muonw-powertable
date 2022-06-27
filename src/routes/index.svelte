<script>
let subDir = process.env.NODE_ENV === 'development' ? '' : 'powertable';
import ptData from '../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>

<h2>Basic Demo (<a href="{subDir}/examples">see more</a>)</h2>
<hr>
   
    
<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>

<br>
<h2>Examples</h2>
<hr>

Please visit the <a href="{subDir}/examples">Examples</a> page.
