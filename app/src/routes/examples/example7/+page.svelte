<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type { Data, Options, Instructs } from '$lib/components/PowerTable.svelte';

let myPowerTable: PowerTable;

let ptInstructs: Instructs[] = [];

// Here we set the instructs automatically based on the first row of data and set parseAs to 'html' for all instruct (we could do this manually too. with parseAs set to 'html', we can edit the cells and see how it handles HTML tags)
let tempInstructs: Instructs[] = [];
Object.keys(data[0]).forEach(key => {
    tempInstructs.push({
        key: key,
        title: key,
        parseAs: 'html',
    });
});
ptInstructs = tempInstructs;

let ptData: Data[] = data;

let ptOptions: Options = {
    checkboxColumn: true,
    segments: {
        'topBar': ['settings', 'search', 'pagination'],
        'pTable': ['table'],
        'bottomBar': ['dropdown', 'stats', 'pagination'],
    },
    userFunctions: {
        deleteActionCallback: (rows) => console.log('deleted rows:', rows),
        editSubmissionCallback: (row) => console.log('updated row:', row),
    },
}

function importJsonData(e: Event) {
    myPowerTable.closeMenu(e);

    fetch('https://raw.githubusercontent.com/muonw/muonw-powertable/main/app/src/data/jobs.json')
    .then(response => response.json())
    .then(data => ptData = data);
}

function exportJsonData(e: Event) {
    myPowerTable.closeMenu(e);

    let currentData = myPowerTable.getData().data;

    // Download JSON object as a file from browser (https://stackoverflow.com/a/30800715)
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentData));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'PowerTable_current_data.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
</script>

<div class="ex7_style1">
    <PowerTable {ptInstructs} {ptData} {ptOptions} bind:this={myPowerTable}>
        <div slot="settings">
            <button data-name="item" on:click={importJsonData}>Import sample data</button>
            <button data-name="item" on:click={exportJsonData}>Export current data</button>
        </div>
        <div slot="noResults">ⓘ Follow the instructions to populate this example table.</div>
    </PowerTable>
</div>

<style>
:global(.ex7_style1 th[data-key=id]){
    width: 50px;
}
:global(.ex7_style1 td[data-key=id] textarea){
    width: 40px ;
}
</style>