<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import MyComponent from './MyComponent.svelte';
import type { Instructs, Data } from '$lib/components/PowerTable.svelte';
import type { ComponentType, SvelteComponent } from 'svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name', sortable: false},
    {key: 'last_name', title: 'Surname'},
    {key: 'company', title: 'Company', filterPhrase: '/p.*i/gi'},
    {key: 'department', title: 'Department 🏢', filterable: false},
    {key: 'job', title: 'Job Title'}
];

let ptInstructs2: Instructs[] = [
    {key: 'id'},
    {key: 'first_name'},
    {key: 'last_name'},
    {key: 'company'},
    {key: 'department'},
    {key: 'job', parseAs: 'component', dataComponent: <ComponentType<SvelteComponent>>MyComponent}
];
</script>


<PowerTable {ptData} {ptInstructs} />

<br>
<hr color="#ccc">
<br>

<PowerTable {ptData} ptInstructs={ptInstructs2} />