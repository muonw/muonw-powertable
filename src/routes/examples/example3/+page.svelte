<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type { Options } from '$lib/components/PowerTable.svelte';

let ptOptions1: Options = {
    uniquePrefix: 'pt1',
    rowsPerPageOptions: [3,5,7],
    rowsPerPage: 3,
    headerFilters: false,
    footerText: false,
    currentPage: 5,
    segments: {
        'myTopSegment': ['dropdown', 'pagination', 'stats'],
        'myTable': ['table'],
    }
}

let ptOptions2: Options = {
    uniquePrefix: 'pt2',
}
</script>


<div class="MuonW PowerTable ptOptions">
    <PowerTable
        ptData={data}
        ptOptions={ptOptions1}
    />
</div>

<br>
<hr color="#ccc">
<br>

<div class="MuonW PowerTable ptOptions">
    <PowerTable
        ptData={data}
        ptOptions={ptOptions2}
    />
</div>


<style global>
.MuonW.PowerTable.ptOptions div[data-prefix=pt1] div[data-name=myTopSegment] {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.5rem 0;
}
.MuonW.PowerTable.ptOptions div[data-prefix=pt1] div[data-name=stats-container] {
    margin: 0;
}
</style>