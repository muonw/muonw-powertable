<script lang="ts">
import { onMount } from "svelte"
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let myPowerTable: PowerTable;
let ptData: Data[] = [];
let ptInstructs: Instructs[] = [];
let ptOptions: Options = {}

onMount(() => {
    ptData = data;
    ptOptions = {
        userFunctions: {
            customParse: myHighlight
        },
        searchPhrase: '/a.*t/gimsu',
        searchIsRegex: true,
        checkboxColumn: true,
    }
    
    // Highlighting is performed by wrapping the matching phrases in a span tag with a colored background.
    // To allow rendering of those span tags, set parseAs to 'html'
    let tempInstructs: Instructs[] = [];
    Object.keys(data[0]).forEach(key => {
        tempInstructs.push({
            key: key,
            title: key,
            parseAs: 'html',
        });
    });
    // Setting the default filter phrase
    tempInstructs[4].filterPhrase = 'man';
    tempInstructs[4].filterIsRegex = false;
    tempInstructs[5].filterPhrase = 'o';
    tempInstructs[5].filterIsRegex = false;

    ptInstructs = tempInstructs;
});

function myHighlight(pageContent: Data[]): Data[] {
    pageContent = myPowerTable.highlighter(pageContent, myPowerTable, ptInstructs);
    return pageContent;
}
</script>


<div>
    <PowerTable {ptData} {ptInstructs} {ptOptions} bind:this={myPowerTable} />
</div>
