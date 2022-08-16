<script lang="ts">
import ptData from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs} from '$lib/components/PowerTable.svelte';

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name'},
    {key: 'last_name', title: 'Last Name'},
    {key: 'company', title: 'Company', filterPhrase: 'Google'},
    {key: 'department', title: 'Department'},
    {key: 'job', title: 'Job'}
];
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptInstructs}>
        <div slot="noResults">This is a custom text that<br> will be shown when there are<br> no rows to display</div>
    </PowerTable>
</div>
