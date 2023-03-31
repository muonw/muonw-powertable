<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type { Data, Instructs, Options } from '$lib/components/PowerTable.svelte';

let ptOptions1: Options = {
    uniquePrefix: 'pt1',
    rowsPerPageOptions: [3,5,7],
    rowsPerPage: 3,
    headerFilters: false,
    footerText: false,
    currentPage: 5,
    segments: {
        'myTopSegment': ['dropdown', 'pagination', 'stats'],
        'myTable': ['table'],
    }
}

let ptInstructs2: Instructs[] = [
    {key: 'id'},
    {key: 'first_name'},
    {key: 'last_name'},
    {key: 'company'},
    {key: 'department'},
    {key: 'job', parseAs: 'html'}
];

let ptOptions2: Options = {
    uniquePrefix: 'pt2',
    translations: {
        numberFormat: 'ja-JP-u-nu-hanidec-ca-japanese',
        search: '検索',
        next: '次',
        previous: '前',
        rows: '行',
        filterBy: 'フィルタ条件',
        selectAll: 'すべて選択',
        selectNone: 'なしを選択',
        invertSelection: '選択範囲を反転',
        add: '追加',
        delete: '消去',
        of: 'の',
        from: 'から',
    },
    userFunctions: {
        customParse: addEmoji
    },
}

function addEmoji(pageData: Data[]) {
    pageData.forEach(row => {
        let emoji = '';

        if (row['job'].match(/(Engineer|Manage|Admin)/i)) {
            emoji = '💼';
        }
        else if (row['job'].match(/(Health|Pharmacist|Nurse)/i)) {
            emoji = '‍💊';
        }
        else if (row['job'].match(/(Data|Programmer)/i)) {
            emoji = '💻';
        }

        row['job'] = emoji ? `<b>${emoji} ${row['job']}</b>` : row['job'];
    });

    return pageData;
}
</script>


<div class="ex3_style1">
    <PowerTable
        ptData={data}
        ptOptions={ptOptions1}
    />
</div>

<br>
<hr color="#ccc">
<br>

<div class="ex3_style1">
    <PowerTable
        ptData={data}
        ptInstructs={ptInstructs2}
        ptOptions={ptOptions2}
    />
</div>


<style>
:global(.ex3_style1 div[data-prefix=pt1] div[data-name=myTopSegment]) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.5rem 0;
}
:global(.ex3_style1 div[data-prefix=pt1] div[data-name=stats-container]) {
    margin: 0;
}
</style>