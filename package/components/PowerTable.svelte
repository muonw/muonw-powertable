<script context="module">export {};
</script>

<script>import { onMount, createEventDispatcher } from 'svelte';
// Props
export var ptInstructs = [];
export let ptOptions = {};
export let ptData = [];
// PowerTable check box key name
let dataIdKey = '__PT_ID__';
let checkboxKey = '__PT_CB__';
let specialInstructs = {
    [dataIdKey]: {
        key: dataIdKey,
        title: '',
        sortable: false,
        filterable: false,
    },
    [checkboxKey]: {
        key: checkboxKey,
        title: '',
        sortable: false,
        filterable: false,
    }
};
const dispatch = createEventDispatcher();
// Associated with options prop (ptOptions) for internal use
let options = {
    uniquePrefix: 'pt',
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    rowsPerPage: 10,
    paginationBlock: 3,
    headerText: true,
    footerText: true,
    headerFilters: true,
    footerFilters: true,
    headerLoadingBar: true,
    footerLoadingBar: true,
    defaultRegexFlags: 'gimsu',
    nestedSorting: false,
    isDataRemote: false,
    totalRows: null,
    filteredRows: null,
    currentPage: 1,
    dataFeedFunction: async () => ({}),
    searchPhrase: '',
    searchIsRegex: false,
    checkboxColumn: false,
    segments: {
        'topBar': ['search', 'pagination'],
        'pTable': ['table'],
        'bottomBar': ['dropdown', 'stats', 'pagination'],
    },
    sortOrder: {
        '': 'asc',
        'asc': 'desc',
        'desc': '',
    },
};
// Associated with instructs prop (ptInstructs) for internal use
let instructs;
// Associated with data prop (ptData) for internal use
let data;
// Changes in props triggers the initialize function
$: initialize(ptInstructs, ptOptions, ptData);
// Filtered and searched data
let matchedData;
// Sorted data
let sortedData = [];
// Data of the current page 
let displayedData = [];
let pagination = {
    totalRows: 0,
    firstShownRow: 0,
    lastShownRow: 0,
    totalPages: 1,
    pages: [1],
};
let sorting = {};
let renderStatus = null;
let searchObj = {
    'isRegex': options.searchIsRegex,
    'value': options.searchPhrase,
};
let filterObj = {};
function initialize(ptInstructs, ptOptions, ptData, action = { render: true, preserveFilters: true }) {
    if (ptOptions) {
        Object.assign(options, ptOptions);
    }
    options = options;
    data = JSON.parse(JSON.stringify(ptData));
    // Make data type conformable to Record<string,string>
    data = data.map(row => {
        Object.keys(row).forEach(key => {
            // If not a special instruct
            if (!specialInstructs.hasOwnProperty(key)) {
                if (row[key] === null) {
                    row[key] = '';
                }
                else if (typeof row[key] === 'object') {
                    row[key] = JSON.stringify(row[key]);
                }
                else {
                    row[key] = row[key].toString();
                }
            }
        });
        return row;
    });
    let tempInstructs = [];
    // If ptInstructs prop is empty
    if (!ptInstructs?.length) {
        let keys = Object?.keys(data?.[0] ?? []);
        keys.forEach(key => {
            // If not a special instruct (they will be added later)
            if (!specialInstructs.hasOwnProperty(key)) {
                tempInstructs.push({
                    key: key,
                    title: key,
                    parse: 'text'
                });
                filterObj[key] = {
                    'isRegex': false,
                    'value': ''
                };
            }
        });
        instructs = tempInstructs;
    }
    else {
        ptInstructs?.forEach(instruct => {
            // If not a special instruct (they will be added later)
            if (!specialInstructs.hasOwnProperty(instruct.key)) {
                tempInstructs.push(instruct);
                // If filters aren't set or should not be preserved, reset them
                if (!filterObj[instruct.key] || !action?.preserveFilters) {
                    filterObj[instruct.key] = {
                        'isRegex': instruct?.isRegex ?? false,
                        'value': instruct?.filterPhrase ?? ''
                    };
                }
            }
        });
        instructs = tempInstructs;
    }
    // Handling spacial instructs
    // Add checkboxes
    if (!instructs?.[0]?.hasOwnProperty(checkboxKey)) {
        instructs = [specialInstructs[checkboxKey], ...instructs];
        filterObj[checkboxKey] = {
            'isRegex': false,
            'value': ''
        };
    }
    let checkboxExists = data?.[0]?.hasOwnProperty(checkboxKey);
    // Add data associated with spacial instructs
    data = data.map((row, index) => {
        // Re-index
        Object.keys(row).forEach(() => delete row[dataIdKey]);
        row = Object.assign({ [dataIdKey]: index }, row);
        if (!checkboxExists) {
            row = Object.assign({ [checkboxKey]: false }, row);
        }
        return row;
    });
    if (action?.render) {
        renderTable();
    }
}
async function renderTable() {
    renderStatus = 'rendering';
    if (options.isDataRemote) {
        let remoteParams = {};
        remoteParams['options'] = options;
        remoteParams['search'] = searchObj;
        remoteParams['filters'] = filterObj;
        let newData = await options.dataFeedFunction(remoteParams);
        if (newData?.data) {
            initialize(newData.instructs ?? [], newData.options ?? {}, newData.data, { render: false });
            // Already filtered on the server
            matchedData = data;
            // Already sorted on the server
            sortedData = matchedData;
        }
    }
    else {
        applyFilters();
        applySort();
    }
    applyPagination();
    renderStatus = 'completed';
}
function trackSorting(key) {
    let newSortingState = options.sortOrder[sorting?.[key] ?? ''];
    if (!options.nestedSorting) {
        sorting = {};
    }
    sorting[key] = newSortingState;
    if (sorting[key] === '') {
        delete sorting[key];
    }
    renderTable();
}
// Applies sorting when data is not remote
function applySort() {
    //*****************************************//
    /* https://github.com/Teun/thenBy.js/blob/master/thenBy.js
     Copyright 2013 Teun Duynstee
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
    */
    var firstBy = (function () {
        function identity(v) { return v; }
        function ignoreCase(v) { return typeof (v) === "string" ? v.toLowerCase() : v; }
        function makeCompareFunction(f, opt) {
            opt = typeof (opt) === "object" ? opt : { direction: opt };
            if (typeof (f) != "function") {
                var prop = f;
                f = function (v1) { return !!v1[prop] ? v1[prop] : ""; };
            }
            if (f.length === 1) {
                var uf = f;
                var preProcess = opt.ignoreCase ? ignoreCase : identity;
                var cmp = opt.cmp || function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
                f = function (v1, v2) { return cmp(preProcess(uf(v1)), preProcess(uf(v2))); };
            }
            const descTokens = { "-1": '', desc: '' };
            if (opt.direction in descTokens)
                return function (v1, v2) { return -f(v1, v2); };
            return f;
        }
        function tb(func, opt) {
            // @ts-ignore
            var x = (typeof (this) == "function" && !this.firstBy) ? this : false;
            var y = makeCompareFunction(func, opt);
            var f = x ? function (a, b) { return x(a, b) || y(a, b); } : y;
            f.thenBy = tb;
            return f;
        }
        tb.firstBy = tb;
        return tb;
    })();
    //*****************************************//
    sortedData = matchedData;
    let compFunc;
    if (Object.keys(sorting).length) {
        Object.entries(sorting).forEach(([key, dir], index) => {
            if (index === 0) {
                compFunc = firstBy(key, { ignoreCase: true, direction: dir });
            }
            else {
                compFunc = compFunc.thenBy(key, { ignoreCase: true, direction: dir });
            }
        });
        sortedData = sortedData.sort(compFunc);
    }
}
function getRegexGroups(phrase) {
    // If regex initiator symbol is present
    if (phrase.indexOf('/') === 0 && phrase.length > 1) {
        // If the regex initiator symbol is escaped, remove the scape symbol and don't mark as regex
        if (phrase.indexOf('//') === 0) {
            phrase = phrase.slice(1);
        }
        else {
            let rgx = new RegExp('^\/(.+)\/(.*)$', 'g').exec(phrase);
            if (rgx) {
                return rgx;
            }
        }
    }
    return null;
}
// Applies filters and search, when data is not remote
function applyFilters() {
    // make a copy of original data
    matchedData = JSON.parse(JSON.stringify(data));
    // Remove any row that doesn't match the searched phrase
    if (searchObj.value) {
        let rgx = getRegexGroups(searchObj.value);
        let regexp;
        if (rgx) {
            try {
                regexp = new RegExp(rgx[1].replace(/\\\\/g, '\\'), rgx?.[2] || options.defaultRegexFlags);
                if (rgx?.[2]) {
                    searchObj.isRegex = true;
                }
                else {
                    // If user is deleting the flags, instead of re-adding the flags, scape the regex character
                    if (searchObj.isRegex) {
                        searchObj.value = '/' + searchObj.value;
                        searchObj.isRegex = false;
                    }
                    else {
                        searchObj.value += options.defaultRegexFlags;
                        searchObj.isRegex = true;
                    }
                }
            }
            catch (e) {
                searchObj.isRegex = false;
            }
        }
        else {
            searchObj.isRegex = false;
        }
        if (searchObj.isRegex) {
            matchedData = matchedData.filter(d => {
                return Object.keys(d).some(key => {
                    if (!specialInstructs.hasOwnProperty(key)) {
                        return regexp.test(d?.[key]);
                    }
                    else {
                        return false;
                    }
                });
            });
        }
        else {
            matchedData = matchedData.filter(d => {
                return Object.keys(d).some(key => {
                    if (!specialInstructs.hasOwnProperty(key)) {
                        return d?.[key]?.toString()?.toLowerCase()?.indexOf(searchObj.value.toLowerCase()) > -1;
                    }
                    else {
                        return false;
                    }
                });
            });
        }
    }
    // Filter out any row that doesn't match the filter phrases
    Object.entries(filterObj).forEach(([key, filter]) => {
        let rgx = null;
        if (filter.value.length) {
            rgx = getRegexGroups(filter.value);
            if (rgx) {
                // If the regex format is invalid (e.g. wrong flags), revert to literal search
                try {
                    matchedData = matchedData.filter(d => new RegExp(rgx?.[1], rgx?.[2] || options.defaultRegexFlags).test(d[key]));
                    if (rgx?.[2]) {
                        filter.isRegex = true;
                    }
                    else {
                        // If user is deleting the flags, instead of re-adding the flags, scape the regex character
                        if (filter.isRegex) {
                            filter.value = '/' + filter.value;
                            filter.isRegex = false;
                        }
                        else {
                            filter.value += options.defaultRegexFlags;
                            filter.isRegex = true;
                        }
                    }
                }
                catch (e) {
                    filter.isRegex = false;
                }
            }
            else {
                filter.isRegex = false;
            }
            if (!filter.isRegex) {
                matchedData = matchedData.filter(d => d[key]?.toString()?.toLowerCase()?.indexOf(filter.value.toLowerCase()) > -1);
            }
        }
        else {
            filter.isRegex = false;
        }
    });
    if (matchedData.length !== data?.length) {
        options.currentPage = 1;
    }
}
function applyPagination() {
    let p = {};
    p.totalRows = options?.totalRows ?? data?.length;
    p.filteredRows = options?.filteredRows ?? sortedData?.length;
    // When deleting a large number of rows, the currentPage might remain higher than the last page
    if (options?.currentPage > p.totalRows / options?.rowsPerPage) {
        options.currentPage = Math.ceil(p.totalRows / options?.rowsPerPage);
        // The lowest currentPage (e.g. when there is no rows) at this point should be 1. Otherwise, firstShownRow will become negative
        if (options.currentPage < 1) {
            options.currentPage = 1;
        }
    }
    p.firstShownRow = Math.min(p.filteredRows, ((options?.currentPage - 1) * options?.rowsPerPage) + 1);
    p.lastShownRow = Math.min(p.filteredRows, options.currentPage * options.rowsPerPage);
    if (options.rowsPerPage) {
        p.totalPages = Math.ceil(p.filteredRows / options.rowsPerPage);
    }
    p.pages = [1];
    // Page #2 or '...' if too many pages (more than sum of first two pages + block + last two pages)
    if (options.currentPage <= options.paginationBlock + 1 || p.totalPages <= options.paginationBlock + 4) {
        if (p.totalPages > 1) {
            p.pages.push(2);
        }
    }
    else if (p.totalPages > options.paginationBlock + 4) {
        p.pages.push(0);
    }
    // Construct the middle block when the currentPage is close enough to page #1 or there aren't too many pages
    if (options.currentPage <= options.paginationBlock + 1 || p.totalPages <= options.paginationBlock + 4) {
        [...Array(options.paginationBlock)].forEach((_, index) => {
            // Exclude the last page if falls within this block
            if ((index + 3) < p.totalPages) {
                p.pages.push(index + 3);
            }
        });
    }
    // Construct the middle block when the currentPage far from the last page (and the first page)
    else if (p.totalPages - options.currentPage > options.paginationBlock) {
        [...Array((options.paginationBlock - 1) / 2)].forEach((_, index) => {
            p.pages.push(options.currentPage - (index + 1));
        });
        p.pages.push(options.currentPage);
        [...Array((options.paginationBlock - 1) / 2)].forEach((_, index) => {
            p.pages.push(options.currentPage + (index + 1));
        });
    }
    // Construct the middle block when the currentPage is far from the first and last page
    else {
        [...Array(options.paginationBlock)].forEach((_, index) => {
            p.pages.push(p.totalPages - (4 - index));
        });
    }
    // Next to last page
    if (p.totalPages > options.paginationBlock + 3) {
        if (options.currentPage >= p.totalPages - options.paginationBlock) {
            p.pages.push(p.totalPages - 1);
        }
        else {
            p.pages.push(0);
        }
    }
    // The last page
    if (p.totalPages >= 3) {
        p.pages.push(p.totalPages);
    }
    if (!options.isDataRemote) {
        // Filter the rows for each page
        displayedData = sortedData.filter((_, i) => {
            if (i + 1 >= p.firstShownRow && i + 1 <= p.lastShownRow) {
                return true;
            }
        });
    }
    else {
        displayedData = sortedData;
    }
    pagination = p;
}
function goToPage(pageNum) {
    options.currentPage = pageNum;
    if (options.isDataRemote) {
        renderTable();
    }
    else {
        applyPagination();
    }
}
function updatePageSize() {
    options.currentPage = 1;
    renderTable();
}
function rowClicked(e, index) {
    dispatch('rowClicked', { event: e, data: displayedData[index] });
}
function rowDblClicked(e, index) {
    dispatch('rowDblClicked', { event: e, data: displayedData[index] });
}
export function closePopUps({ target }) {
    const poppedEls = Array.from(document.querySelectorAll('[data-popped=true]'));
    const closestPoppedEl = target?.closest('[data-popped=true]');
    poppedEls.forEach(p => {
        if (p != closestPoppedEl) {
            p.style.visibility = 'hidden';
            p.dataset.popped = '';
        }
    });
}
export function closeMenu(e) {
    if (e) {
        let menuEl = e?.target?.closest('div[data-name=menu]');
        if (menuEl) {
            menuEl.style.visibility = 'hidden';
            menuEl.dataset.popped = '';
        }
    }
}
export function toggleMenu(e) {
    let menuEl = e?.target?.parentElement?.querySelector('div[data-name=menu]');
    if (menuEl) {
        if (menuEl.style.visibility !== 'visible') {
            closePopUps(e);
            menuEl.style.visibility = 'visible';
            menuEl.dataset.popped = 'true';
            e.stopPropagation();
        }
    }
}
export function toggleCheckboxColumn(e) {
    closeMenu(e);
    options.checkboxColumn = !options.checkboxColumn;
    // Trigger the initialization
    ptOptions = options;
}
export function selectAllAction(e) {
    closeMenu(e);
    data = data.map(row => {
        row[checkboxKey] = true;
        return row;
    });
    // Trigger the initialization
    ptData = data;
}
export function selectNoneAction(e) {
    closeMenu(e);
    data = data.map(row => {
        delete row[checkboxKey];
        return row;
    });
    // Trigger the initialization
    ptData = data;
}
export function invertSelectionAction(e) {
    closeMenu(e);
    data = data.map(row => {
        row[checkboxKey] = !row[checkboxKey];
        return row;
    });
    // Trigger the initialization
    ptData = data;
}
export function addAction(e) {
    closeMenu(e);
    let emptyRow = {};
    Object.keys(data[0]).forEach(key => {
        if (key === dataIdKey) {
            emptyRow[key] = data.length;
        }
        else if (key === checkboxKey) {
            emptyRow[key] = true;
        }
        else {
            emptyRow[key] = '';
        }
    });
    data = [...data, emptyRow];
    options.currentPage = Math.ceil(data.length / options?.rowsPerPage);
    // Trigger the initialization
    ptData = data;
}
export function deleteAction(e) {
    closeMenu(e);
    data = data.filter(row => {
        return !row[checkboxKey];
    });
    // Trigger the initialization
    ptData = data;
}
export function getData(removeMetadata = true) {
    let exportData = JSON.parse(JSON.stringify(data));
    let exportInstructs = JSON.parse(JSON.stringify(instructs));
    if (removeMetadata) {
        exportData.map(row => {
            Object.keys(row).forEach(key => {
                specialInstructs.hasOwnProperty(key) ? delete (row[key]) : null;
            });
            return row;
        });
        exportInstructs = exportInstructs.filter(instruct => !specialInstructs.hasOwnProperty(instruct.key));
    }
    return {
        options: options,
        instructs: exportInstructs,
        data: exportData,
    };
}
onMount(async () => {
    window.addEventListener('click', closePopUps);
    return () => {
        window.removeEventListener('click', closePopUps);
    };
});
</script>


<div data-name="main-container" data-prefix="{options.uniquePrefix}" data-status={renderStatus}>
    {#each Object.entries(options.segments ?? {}) as [segment_name, segment_arr]}
        <div data-name={segment_name} data-type="segment">
            {#each segment_arr as segment_code, segment_index}
                {#if segment_code.toLowerCase() === 'search'}
                    <div data-name="search-container" data-segment_index={segment_index}>
                        <label class="floated">
                            <span>Search</span>
                            <input data-name="search-input" type="text" placeholder=" " data-is_regex={searchObj.isRegex} bind:value={searchObj.value} on:input={renderTable}>
                        </label>
                    </div>
                {:else if segment_code.toLowerCase() === 'stats'}
                    <div data-name="stats-container" data-segment_index={segment_index}>
                        {pagination.firstShownRow}-{pagination.lastShownRow} of {options.filteredRows ?? sortedData.length} 
                        {#if ((options.filteredRows ?? sortedData.length) !== pagination.totalRows) }
                            (from {pagination.totalRows})
                        {/if}
                    </div>
                {:else if segment_code.toLowerCase() === 'table'}
                    <div data-name="table-container" data-segment_index={segment_index}>
                        <table>
                            <thead>
                                {#if options.headerLoadingBar}
                                    <tr data-name="loading_bar-tr">
                                        <th colspan={instructs.length}></th>
                                    </tr>
                                {/if}
                                {#if options.headerText}
                                    <tr data-name="titles-tr">
                                        {#each instructs as instruct}
                                            {#if specialInstructs.hasOwnProperty(instruct?.key)}
                                                {#if instruct?.key === checkboxKey && options.checkboxColumn}
                                                    <th data-key={instruct.key} data-sortable={instruct?.sortable}>
                                                        <div data-name="actions-container">
                                                            <div data-name="handle" on:click={toggleMenu}>⚙️</div>
                                                            <div data-name="menu">
                                                                <div data-name="item" on:click={selectAllAction}>Select All</div>
                                                                <div data-name="item" on:click={selectNoneAction}>Select None</div>
                                                                <div data-name="item" on:click={invertSelectionAction}>Invert Selection</div>
                                                                <div data-name="item" on:click={addAction}>Add</div>
                                                                <div data-name="item" on:click={deleteAction}>Delete</div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                {/if}
                                            {:else}
                                                <th data-key={instruct.key} data-sortable={instruct?.sortable} data-dir={sorting?.[instruct?.key]} on:click={() => {if(instruct?.sortable !== false){trackSorting(instruct.key)}}}>{instruct.title}</th>
                                            {/if}
                                        {/each}
                                    </tr>
                                {/if}
                                {#if options.headerFilters}
                                    <tr data-name="filters-tr">
                                        {#each instructs as instruct}
                                            {#if specialInstructs.hasOwnProperty(instruct?.key)}
                                                {#if instruct?.key === checkboxKey && options.checkboxColumn}
                                                    <th data-key={instruct.key}></th>
                                                {/if}
                                            {:else}
                                                <th data-key={instruct.key}>
                                                    {#if instruct?.filterable !== false}
                                                        <input data-key={instruct.key} data-is_regex={filterObj[instruct.key].isRegex} placeholder="Filter by {instruct.title}" bind:value={filterObj[instruct.key].value} on:input={renderTable} >
                                                    {/if}
                                                </th>
                                            {/if}
                                        {/each}
                                    </tr>
                                {/if}
                            </thead>
                            <tbody>
                                {#if displayedData.length}
                                    {#each displayedData as record, index}
                                        <tr data-index={index} on:click={(e)=>rowClicked(e, index)} on:dblclick={(e)=>rowDblClicked(e, index)}>
                                            {#each instructs as instruct}
                                                {#if specialInstructs.hasOwnProperty(instruct?.key)}
                                                    {#if instruct?.key === checkboxKey && options.checkboxColumn}
                                                        <td data-key={instruct.key}>
                                                            <input type="checkbox" bind:checked={data[record[dataIdKey]][checkboxKey]} />
                                                        </td>
                                                    {/if}
                                                {:else}
                                                    <td data-key={instruct.key}>
                                                        {#if data[record[dataIdKey]]?.[checkboxKey]}
                                                            <textarea bind:value={data[record[dataIdKey]][instruct.key]}></textarea>
                                                        {:else if instruct?.parse === 'unsafe-html'}
                                                            {@html (typeof (instruct?.render ?? null) === 'function') && instruct.render !== undefined ? instruct.render(data[record[dataIdKey]][instruct.key] ?? '') : (data[record[dataIdKey]][instruct.key] ?? '')}
                                                        {:else}
                                                            {(typeof (instruct?.render ?? null) === 'function') && instruct.render !== undefined ? instruct.render(data[record[dataIdKey]][instruct.key] ?? '') : (data[record[dataIdKey]][instruct.key] ?? '')}
                                                        {/if}
                                                    </td>
                                                {/if}
                                            {/each}
                                        </tr>
                                    {/each}
                                {:else if renderStatus === 'completed'}
                                    <tr>
                                        <td data-name="noResults-td" colspan={instructs.length}>
                                            {#if $$slots.noResults}
                                                <slot name="noResults" />
                                            {:else}
                                                <div>Nothing to display</div>
                                            {/if}
                                        </td>
                                    </tr>
                                {:else if renderStatus === 'rendering'}
                                    <tr>
                                        <td data-name="rendering-td" colspan={instructs.length}>
                                            {#if $$slots.rendering}
                                                <slot name="rendering" />
                                            {:else}
                                                <div>Loading...</div>
                                            {/if}
                                        </td>
                                    </tr>
                                {/if}
                            </tbody>
                            <tfoot>
                                {#if options.footerFilters}
                                    <tr data-name="filters-tr">
                                        {#each instructs as instruct}
                                            {#if specialInstructs.hasOwnProperty(instruct?.key)}
                                                {#if instruct?.key === checkboxKey && options.checkboxColumn}
                                                    <th data-key={instruct.key}></th>
                                                {/if}
                                            {:else}
                                                <th data-key={instruct.key}>
                                                    {#if instruct?.filterable !== false}
                                                        <input data-key={instruct.key} data-is_regex={filterObj[instruct.key].isRegex} placeholder="Filter by {instruct.title}" bind:value={filterObj[instruct.key].value} on:input={renderTable} >
                                                    {/if}
                                                </th>
                                            {/if}
                                        {/each}
                                    </tr>
                                {/if}
                                {#if options.footerText}
                                    <tr data-name="titles-tr">
                                        {#each instructs as instruct}
                                            {#if specialInstructs.hasOwnProperty(instruct?.key)}
                                                {#if instruct?.key === checkboxKey && options.checkboxColumn}
                                                    <th data-key={instruct.key} data-sortable={instruct?.sortable}></th>
                                                {/if}
                                            {:else}
                                                <th data-key={instruct.key} data-sortable={instruct?.sortable} data-dir={sorting?.[instruct?.key]} on:click={() => {if(instruct?.sortable !== false){trackSorting(instruct.key)}}}>{instruct.title}</th>
                                            {/if}
                                        {/each}
                                    </tr>
                                {/if}
                                {#if options.footerLoadingBar}
                                    <tr data-name="loading_bar-tr">
                                        <th colspan={instructs.length}></th>
                                    </tr>
                                {/if}
                            </tfoot>
                        </table>
                    </div>
                {:else if segment_code.toLowerCase() === 'dropdown'}
                    <div data-name="dropdown-container" data-segment_index={segment_index}>
                        Rows: 
                        <select bind:value={options.rowsPerPage} on:change={updatePageSize}>
                            {#each options.rowsPerPageOptions ?? [] as num}
                                <option value={num}>{num}</option>
                            {/each}
                        </select>
                    </div>
                {:else if segment_code.toLowerCase() === 'settings'}
                    <div data-name="settings-container" data-segment_index={segment_index}>
                        <div data-name="handle" on:click={toggleMenu}>🛠️</div>
                        <div data-name="menu">
                            {#if $$slots.settings}
                                <slot name="settings" />
                            {:else}
                                <div data-name="item" on:click={toggleCheckboxColumn}>{options.checkboxColumn ? 'Hide' : 'Show'} checkboxes</div>
                            {/if}
                        </div>
                    </div>
                {:else if segment_code.toLowerCase() === 'pagination'}
                    <div data-name="pagination-container" data-segment_index={segment_index}>
                        <span data-disabled={options.currentPage === 1} on:click={()=>options.currentPage !== 1 ? goToPage((options.currentPage ?? 1) - 1) : null}>Previous</span>

                        {#if pagination.totalPages}
                            {#each pagination.pages ?? [] as pageNum}
                                {#if pageNum === 0}
                                    <span data-disabled={true}>...</span>
                                {:else}
                                    <span data-active={options.currentPage === pageNum} on:click={()=>options.currentPage !== pageNum ? goToPage(pageNum) : null}>{pageNum}</span>
                                {/if}
                            {/each}
                        {:else}
                            <span data-active={true}>1</span>
                        {/if}

                        <span data-disabled={!pagination.totalPages || options.currentPage === pagination.totalPages} on:click={()=>options.currentPage !== pagination.totalPages ? goToPage((options.currentPage ?? 1) + 1) : null}>Next</span>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
    