<script lang="ts">
import data from '../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Options} from '$lib/components/PowerTable.svelte';

let ptOptions: Options = {
    rowsPerPage: 20,
}
</script>


<div class="MuonW PowerTable ptStyles1">
    <PowerTable
        ptData={data}
        ptOptions={ptOptions}
    />
</div>


<style global>
.MuonW.PowerTable.ptStyles1 div[data-name=table-container] {
    max-height: 340px;
}
.MuonW.PowerTable.ptStyles1 div[data-name="table-container"] table tbody td {
    padding: 0.9rem 0.4rem;
}
.MuonW.PowerTable.ptStyles1 div[data-name="table-container"] table tbody td[data-key=id] {
    transform: rotate(-90deg);
    text-align: center;
}
.MuonW.PowerTable.ptStyles1 div[data-name="table-container"] table tbody tr:nth-child(2n) {
    background-color: #fcf3ff;
}
</style>