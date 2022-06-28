<script lang="ts">
import data from '../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID'},
    {key: 'first_name', title: 'First Name', sortable: false},
    {key: 'last_name', title: 'Surname'},
    {key: 'company', title: 'Company', filterPhrase: '/p.*i/gi'},
    {key: 'department', title: 'Department 🏢', filterable: false},
    {key: 'job', title: 'Job Title', parse: 'unsafe-html', render: addEmoji}
];

let ptOptions: Options = {}


function addEmoji(d: string) {
    let emoji = '';

    if (d.indexOf('Engineer') !== -1 || d.indexOf('Manage') !== -1) {
        emoji = '💼';
    }
    else if (d.indexOf('Health') !== -1 || d.indexOf('Nurse') !== -1) {
        emoji = '‍💊';
    }
    else if (d.indexOf('Data') !== -1) {
        emoji = '💻';
    }

    return emoji ? `<b>${emoji} ${d}</b>` : d;
}
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptInstructs} {ptOptions} />
</div>
