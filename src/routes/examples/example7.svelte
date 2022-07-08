<script lang="ts">
import type { SvelteComponent } from "svelte"
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Data, Options} from '$lib/components/PowerTable.svelte';

let myPowerTable: SvelteComponent;

let ptData: Data[] = [
    {"id": 1, "name": "Fay"},
    {"id": 2, "name": "Luca"}
];

let ptOptions: Options = {
    checkboxColumn: true,
    segments: {
        'topBar': ['settings', 'search', 'pagination'],
        'pTable': ['table'],
        'bottomBar': ['dropdown', 'stats', 'pagination'],
    }
}

function importJsonData(e: MouseEvent) {
    myPowerTable.closeMenu(e);

    fetch('https://raw.githubusercontent.com/muonw/powertable/main/src/data/jobs.json')
    .then(response => response.json())
    .then(data => ptData = data);
}

function exportJsonData(e: MouseEvent) {
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

<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptOptions} bind:this={myPowerTable}>
        <div slot="settings">
            <div data-name="item" on:click={importJsonData}>Import sample data</div>
            <div data-name="item" on:click={exportJsonData}>Export current data</div>
        </div>
        <div slot="noResults">ⓘ Follow the instructions to populate this example table.</div>
    </PowerTable>
</div>
