<script lang="ts">
import { onMount } from 'svelte';
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type { Instructs, Options, Data } from '$lib/components/PowerTable.svelte';

let powerTableRef: PowerTable;

// We use an empty array as a placeholder and will add the actual data after the component is mounted
let ptData: Data[] = [];

let ptInstructs: Instructs[] = [
    {key: 'id', parseAs: 'unsafe-html'},
    {key: 'first_name'},
    {key: 'last_name'},
];

let ptOptions: Options = {
    rowsPerPage: 20,
    userFunctions: {
        customParse: addLink
    },
}

function addLink(pageData: Data[]): Data[] {
    // powerTableRef will not be available until the component is mounted
    if (!powerTableRef) {
        // Since powerTableRef is not defined, this is the initial loading
        // of the placeholder data (an empty array that we defined earlier)
        // So we skip the processing
        return pageData;
    }

    let updatedData = powerTableRef.getData(false, ['options','sortedData']);
    let options = updatedData.options;
    let sortedData = updatedData.sortedData;

    pageData.forEach((row, index) => {
        // The following code picks a target row at some arbitrary distance after
        // or before the current row for better demonstrating the scroll effect
        let jumpLength = Math.floor(options.rowsPerPage! / 2);
        // The value of the `data-id` attribute of the target <tr> element
        let targetRowId = (index + ((options.currentPage! - 1) * options.rowsPerPage!)) + jumpLength;
        
        // If our arbitrary distance makes the target fall out of range, pick another target
        if (targetRowId >= sortedData.length) {
            if (targetRowId - jumpLength > 0) {
                targetRowId = (index + ((options.currentPage! - 1) * options.rowsPerPage!)) - jumpLength;
            } else {
                targetRowId = 0;
            }
        }

        // Value of the first column on the target row just for demonstration
        // (happens to be named `id` in our dataset, but could be anything)
        let targetValue = sortedData[targetRowId] ? sortedData[targetRowId]['id'] : 0;

        // We set a data attribute here, not an event attribute such as onClick
        row['id'] = `${row['id']} <button class="btn lean" data-jump="${targetRowId}">Jump to index ${targetRowId} (value: ${targetValue})</button>`;
    });

    return pageData;
}

function rowClicked(e: CustomEvent) {
    let clickedEl = e.detail.event.target;
    let targetRowId: number;
    
    if (targetRowId = parseInt(clickedEl.getAttribute('data-jump'))) {
        let selector = `#myPowerTable tr[data-id="${targetRowId}"]`;
        let targetRow = <HTMLTableRowElement>document.querySelector(selector);
        
        // If targetRow is not in the current page, we need to change the page
        // and wait for the element to be rendered
        if (!targetRow) {
            let updatedData = powerTableRef.getData(true, ['options','sortedData']);
            let targetRowPage = Math.ceil((targetRowId + 1) / updatedData.options.rowsPerPage!);

            // Switch to the page that contains the target row 
            ptOptions = {
                ...ptOptions,
                currentPage: targetRowPage
            }

            // Scroll to the target as soon as it becomes available
            waitForRow(selector).then((el: HTMLTableRowElement) => {
                scrollToRow(el);
            });
        } else {
            scrollToRow(targetRow);
        }
    }
}

function scrollToRow(targetRow: HTMLTableRowElement) {
    targetRow.scrollIntoView({behavior: 'smooth'}); 
    targetRow.classList.add('flash');
    setTimeout(function(){ targetRow.classList.remove('flash'); }, 1500);
}

// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForRow(selector: string) {
    return new Promise<HTMLTableRowElement>(resolve => {
        if (document.querySelector(selector)) {
            return resolve(<HTMLTableRowElement>document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(<HTMLTableRowElement>document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

onMount(() => {
    // Now we add data to table to trigger our customParse function
    // while the component is mounted
    ptData = data;
});
</script>


<div id="myPowerTable" class="ex11_style1">
    <PowerTable {ptData} {ptOptions} {ptInstructs} on:rowClicked={rowClicked} bind:this={powerTableRef} />
</div>


<div style="height:90vh;"><br><small>The empty space after this line is intentional.</small></div>

<style>
:global(.ex11_style1 th[data-key=id]) {
    width: auto !important;
}
:global(.ex11_style1 td[data-key=id] button) {
    margin-left: .5rem;
}
:global(.ex11_style1 .flash) {
    animation: ex11_style1_blinker .5s 4 linear;
}
@keyframes ex11_style1_blinker {
    50% {
        background-color: rgba(62, 145, 62, .4);
    }
}
</style>