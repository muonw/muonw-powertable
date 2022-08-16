<script>
import ptData from '../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
</script>

<br>

<h2><a href="https://github.com/muonw/powertable">▦</a> PowerTable</h2>
<p>
    PowerTable is a JavaScript component that turns JSON data into an interactive HTML table.<br>
    This facilitates manual inspection, sorting, filtering, searching, and editing of the data.<br>
    Click here to learn more: <a href="https://github.com/muonw/powertable">https://github.com/muonw/powertable</a>
</p>

<br>

<h2><a href="powertable/examples/example1">👀 Click here to see all examples</a></h2>

<br>

<h3>Basic Demo</h3>
<hr>
    
<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>
