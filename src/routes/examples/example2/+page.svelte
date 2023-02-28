<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name', sortable: false},
    {key: 'last_name', title: 'Surname'},
    {key: 'company', title: 'Company', filterPhrase: '/p.*i/gi'},
    {key: 'department', title: 'Department 🏢', filterable: false},
    {key: 'job', title: 'Job Title'}
];
</script>


<PowerTable {ptData} {ptInstructs} />
