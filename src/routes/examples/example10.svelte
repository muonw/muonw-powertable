<script lang="ts">
import data from '../../data/scores.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let ptData: Data[] = data;

let ptInstructs: Instructs[] = [
    {key: 'score', title: 'Score', sortable: false, filterPhrase: '6-85', userFunctions: {customFilter: myIntRangeFilter}},
    {key: 'full_name', title: 'Full Name'},
    {key: 'birthday', title: 'Birthday', sortable: false, filterPhrase: '06/09/2000-01/30/2030', userFunctions: {customFilter: myDateRangeFilter}},
    {key: 'fav_color', title: 'Favorite Color', sortable: false, parseAs: 'unsafe-html', userFunctions: {}},
];

let ptOptions: Options = {
    userFunctions: {
        customParse: addColors,
        customSearch: mySearch
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

function mySearch(data: Data[], searchPhrase: string): {data: Data[], continue: boolean} {
    if (searchPhrase.trim()) {
        data = data.filter(d => {
            return parseInt(d.score) % 2 === 0;
        });
    }
    return {data: data, continue: true};
}

function myIntRangeFilter(data: Data[], filterPhrase: string): {data: Data[], continue: boolean} {
    if (filterPhrase.trim()) {
        let rangeParts = filterPhrase.match(/^([\d ]+)-([\d ]+)$/);

        // If at least one of the lower or upper range exists
        if (rangeParts?.[1]?.trim() || rangeParts?.[2]?.trim()) {
            let lowerRange = parseInt(rangeParts?.[1]);
            let upperRange = parseInt(rangeParts?.[2]);
            
            data = data.filter(d => {
                return parseInt(d.score) >= lowerRange && parseInt(d.score) <= upperRange;
            });
            return {data: data, continue: false};
        }
    }
    return {data: data, continue: true};
}

function myDateRangeFilter(data: Data[], filterPhrase: string): {data: Data[], continue: boolean} {
    if (filterPhrase.trim()) {
        let rangeParts = filterPhrase.match(/^(\d{2}\/\d{2}\/\d{4})-(\d{2}\/\d{2}\/\d{4})$/);

        // If at least one of the lower or upper range exists
        if (rangeParts?.[1] && rangeParts?.[2]) {
            let lowerRange = new Date(rangeParts?.[1]);
            let upperRange = new Date(rangeParts?.[2]);
            
            data = data.filter(d => {
                return new Date(d.birthday) >= lowerRange && new Date(d.birthday) <= upperRange;
            });
            return {data: data, continue: false};
        }
    }
    return {data: data, continue: true};
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