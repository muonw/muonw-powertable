<script lang="ts">
import data from '../data/users.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name'},
    {key: 'last_name', title: 'Last Name'},
    {key: 'email', title: 'Email'},
    {key: 'gender', title: 'Gender'},
    {key: 'date_of_birth', title: 'DOB'},
];

let ptOptions: Options = {}
</script>


<div class="powerTable">
    <PowerTable {ptData} {ptInstructs} {ptOptions} />
</div>


<style lang="scss" global>
.powerTable{
    @import '../lib/styles/power-table.scss';
}
</style>