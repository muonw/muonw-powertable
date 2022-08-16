<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, DataFeed} from '$lib/components/PowerTable.svelte';

let ptInstructs: Instructs[] = [
    {key: 'id', title: 'ID', sortable: false, filterable: false},
    {key: 'first_name', title: 'First Name', sortable: false, filterable: false},
    {key: 'last_name', title: 'Surname', sortable: false, filterable: false},
    {key: 'company', title: 'Company', sortable: false, filterable: false},
    {key: 'department', title: 'Department', sortable: false, filterable: false},
    {key: 'job', title: 'Job Title', sortable: false, filterable: false}
];

let ptOptions: Options = {
    isDataRemote: true,
    userFunctions: {
        dataFeed: dummyApiCall,
    },
    segments: {
        'topBar': ['stats', 'pagination'],
        'pTable': ['table']
    }
}

async function dummyApiCall({filters, options, search}: Record<string,any>): Promise<DataFeed> {
    // Simulating the server side operations
    console.log(filters, options, search);

    let dataCopy = JSON.parse(JSON.stringify(data));

    let totalRows = dataCopy.length;
    let selectedPage = options.currentPage;
    let rowsPerPage = options.rowsPerPage;

    let totalPages = Math.ceil(totalRows / rowsPerPage);
    let firstRow = (selectedPage - 1) * rowsPerPage;
    let lastRow = firstRow + rowsPerPage - 1;
    
    if (lastRow > totalRows) {
        lastRow = totalRows;
    }

    dataCopy = dataCopy.slice(firstRow, lastRow);
    
    options.totalRows = totalRows;
    options.totalPages = totalPages;
    options.filteredRows = totalRows;

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        instructs: ptInstructs,
        options: options,
        data: dataCopy
    }
}
</script>


<div class="MuonW PowerTable">
    <PowerTable {ptOptions} {ptInstructs} />
</div>
