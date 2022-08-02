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
    {key: 'job', title: 'Job Title', parseAs: 'unsafe-html'}
];

let ptOptions: Options = {
    userFunctions: {
        pageMod: addEmoji
    }
}


function addEmoji(pageData: Data[]) {
    pageData.forEach(row => {
        let emoji = '';

        if (row['job'].indexOf('Engineer') !== -1 || row['job'].indexOf('Manage') !== -1) {
            emoji = '💼';
        }
        else if (row['job'].indexOf('Health') !== -1 || row['job'].indexOf('Nurse') !== -1) {
            emoji = '‍💊';
        }
        else if (row['job'].indexOf('Data') !== -1) {
            emoji = '💻';
        }

        row['job'] = emoji ? `<b>${emoji} ${row['job']}</b>` : row['job'];
    });

    return pageData;
}
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptInstructs} {ptOptions} />
</div>
