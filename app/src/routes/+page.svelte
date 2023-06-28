<script>
import ptData from '../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import { base } from "$app/paths";

import '$lib/styles/power-table.scss';
import '$lib/styles/power-table-mascara.scss';
</script>

<h2><a href="https://github.com/muonw/muonw-powertable">▦</a> PowerTable</h2>
<p>
    PowerTable is a Svelte component that turns JSON data into an interactive HTML table.<br>
    This facilitates manual inspection, sorting, filtering, searching, and editing of the data.<br>
    PowerTable is inspired by DataTables and powered by Svelte.<br>
    Click here to learn more: <a href="https://github.com/muonw/muonw-powertable">https://github.com/muonw/muonw-powertable</a>
</p>

<br>

<h2><a href="{base}/examples/example1">👀 Click here to see all examples</a></h2>

<br>

<h3>Basic Demo</h3>
<hr>
    

<PowerTable {ptData} />
