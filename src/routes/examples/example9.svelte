<script lang="ts">
import data from '../../data/scores.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'score', title: 'Score', userFunctions: {customSort: sortNumbers}},
    {key: 'full_name', title: 'Full Name'},
    {key: 'birthday', title: 'Birthday', userFunctions: {customSort: sortDates}},
    {key: 'fav_color', title: 'Favorite Color', sortCaseSensitive: true, parseAs: 'unsafe-html', userFunctions: {customSort: sortColors}},
];

let ptOptions: Options = {
    userFunctions: {
        customParse: addColors,
    },
    nestedSorting: true,
    checkboxColumn: true
}

function addColors(pageContent: Data[]): Data[] {
    pageContent.forEach(row => {
        row['fav_color'] = `<span class="colorBall" style="background-color: ${row['fav_color']}"></span> ${row['fav_color']}`;
    });
    return pageContent;
}

function sortNumbers(v1: string, v2: string): number {
    return parseFloat(v1) < parseFloat(v2) ? -1 : parseFloat(v1) > parseFloat(v2) ? 1 : 0;
}

function sortDates(v1: string, v2: string): number {
    return new Date(v1) < new Date(v2) ? -1 : new Date(v1) > new Date(v2) ? 1 : 0;
}

function sortColors(v1: string, v2: string): number {
    let colorOrder = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'];
    return colorOrder.indexOf(v1) < colorOrder.indexOf(v2) ? -1 : colorOrder.indexOf(v1) > colorOrder.indexOf(v2) ? 1 : 0;
}
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptData} {ptInstructs} {ptOptions} />
</div>

<style global>
.MuonW.PowerTable .colorBall{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle;
}
.MuonW.PowerTable th[data-key=score]{
    width: 50px;
}
.MuonW.PowerTable td[data-key=score] textarea {
    width: 40px ;
}
</style>