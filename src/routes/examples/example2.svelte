<script lang="ts">
import data from '../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name'},
    {key: 'last_name', title: 'Last Name'},
    {key: 'company', title: 'Company'},
    {key: 'department', title: 'Department'},
    {key: 'job', title: 'Job'}
];

let ptOptions: Options = {}
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptInstructs} {ptOptions} />
</div>
