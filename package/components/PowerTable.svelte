<script context="module">// PowerTable check box key name
export let dataIdKey = '__PT_ID__';
export let checkboxKey = '__PT_CB__';
// If phrase is a valid regex, return the regex parts
export function getRegexParts(phrase) {
    if (phrase.length > 1) {
        try {
            const groups = phrase.match(/^([/~#;%@'])(.+)\1([gimsuy]*)$/);
            if (groups && !!new RegExp(groups[2], groups[3])) {
                return {
                    delimiter: groups[1],
                    pattern: groups[2],
                    flags: groups[3]
                };
            }
        }
        catch (e) { }
    }
    return false;
}
</script>

<script>import { onMount, createEventDispatcher } from 'svelte';
// Props
export var ptInstructs = [];
export let ptOptions = {};
export let ptData = [];
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
    userFunctions: {
        dataFeed: async () => ({}),
    },
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
let pageData = [];
// pageData after applying a user defined format function
let formattedPageData = [];
let pagination = {
    totalRows: 0,
    firstShownRow: 0,
    lastShownRow: 0,
    totalPages: 1,
    pages: [1],
};
let sorting = {};
let renderStatus = null;
let searchObj = {};
let filterObj = {};
function initialize(ptInstructs, ptOptions, ptData, action = { render: true, preserveFilters: true }) {
    if (ptOptions) {
        Object.assign(options, ptOptions);
    }
    options = options;
    // If search object is not set or should not be preserved, reset it
    // The `preserveFilters` action is intended to affect both "filters" and "search"
    if (!searchObj?.value || !action?.preserveFilters) {
        searchObj = {
            value: options.searchPhrase,
            isRegex: options.searchIsRegex,
            isCustom: false
        };
    }
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
        let firstRecordKeys = Object.keys(data?.[0] ?? []);
        firstRecordKeys.forEach(key => {
            // If not a special instruct (they will be added later)
            if (!specialInstructs.hasOwnProperty(key)) {
                tempInstructs.push({
                    key: key,
                    title: key,
                    parseAs: 'text'
                });
                filterObj[key] = {
                    value: '',
                    isRegex: false,
                    isCustom: false
                };
            }
        });
        instructs = tempInstructs;
    }
    else {
        ptInstructs?.forEach(instruct => {
            // If not a special instruct (they will be added later)
            if (!specialInstructs.hasOwnProperty(instruct.key)) {
                if (!instruct.hasOwnProperty('title')) {
                    instruct['title'] = instruct['key'];
                }
                tempInstructs.push(instruct);
                // If filters aren't set or should not be preserved, reset them
                if (!filterObj[instruct.key] || !action?.preserveFilters) {
                    filterObj[instruct.key] = {
                        value: instruct?.filterPhrase ?? '',
                        isRegex: instruct?.filterIsRegex ?? false,
                        isCustom: false
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
            value: '',
            isRegex: false,
            isCustom: false
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
        let newData = await options.userFunctions?.dataFeed(remoteParams);
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
    const firstBy = (function () {
        const preserveCase = (v) => v;
        const removeCase = (v) => typeof (v) === "string" ? v.toLowerCase() : v;
        const makeCompareFunction = (f, opt) => {
            opt = typeof (opt) === "object" ? opt : { direction: opt };
            if (typeof (f) != "function") {
                var prop = f;
                f = function (v1) { return !!v1[prop] ? v1[prop] : ""; };
            }
            if (f.length === 1) {
                var uf = f;
                var preProcess = opt.caseSensitive ? preserveCase : removeCase;
                var cmp = opt.cmp || function (v1, v2) { return v1 < v2 ? -1 : v1 > v2 ? 1 : 0; };
                f = (v1, v2) => cmp(preProcess(uf(v1)), preProcess(uf(v2)));
            }
            const descTokens = { "-1": '', desc: '' };
            if (opt.direction in descTokens)
                return function (v1, v2) { return -f(v1, v2); };
            return f;
        };
        function tb(func, opt) {
            // @ts-ignore
            var x = (typeof (this) === "function" && !this.firstBy) ? this : false;
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
            let opt = {
                caseSensitive: false,
                direction: dir
            };
            let instruct = instructs.find(instruct => instruct.key === key);
            if (instruct?.sortCaseSensitive) {
                opt.caseSensitive = true;
            }
            if (instruct?.userFunctions?.customSort) {
                opt.cmp = instruct.userFunctions.customSort;
            }
            if (index === 0) {
                compFunc = firstBy(key, opt);
            }
            else {
                compFunc = compFunc.thenBy(key, opt);
            }
        });
        sortedData = sortedData.sort(compFunc);
    }
}
// Applies filters and search, when data is not remote
function applyFilters() {
    // Make a copy of original data
    matchedData = JSON.parse(JSON.stringify(data));
    let previousSearchObj = JSON.parse(JSON.stringify(searchObj));
    searchObj.isRegex = false;
    searchObj.isCustom = false;
    if (searchObj.value) {
        // By default search continues after a custom search
        let customSearchContinue = true;
        if (typeof (options.userFunctions?.customSearch ?? null) === 'function' && options.userFunctions?.customSearch !== undefined) {
            let customSearchResult = options.userFunctions.customSearch(matchedData, searchObj.value);
            matchedData = customSearchResult.data;
            customSearchContinue = customSearchResult.continue;
            searchObj.isCustom = !customSearchContinue;
        }
        // Filter out any row that doesn't match the searched phrase
        if (customSearchContinue !== false) {
            let regexParts = getRegexParts(searchObj.value);
            let regexp;
            if (regexParts) {
                try {
                    let flags = regexParts.flags;
                    searchObj.isRegex = true;
                    // Unless all flags are just being deleted from a regex, add the default flags
                    if (!regexParts?.flags && !previousSearchObj.isRegex) {
                        flags = options.defaultRegexFlags;
                        searchObj.value += flags;
                    }
                    regexp = new RegExp(regexParts.pattern, flags);
                }
                catch (e) { }
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
                let words = searchObj.value.trim().toLowerCase().match(/\S+/g);
                // Iterate over the rows
                matchedData = matchedData.filter(d => {
                    let unmatchedWords = Object.assign([], words);
                    // Iterate over the fields and remove the matching words from unmatchedWords
                    for (let key of Object.keys(d)) {
                        // If not a special column (e.g. checkboxes)
                        if (!specialInstructs.hasOwnProperty(key)) {
                            let searchableString = d?.[key]?.toString()?.toLowerCase();
                            unmatchedWords = unmatchedWords.filter((word) => {
                                if (searchableString?.indexOf(word) > -1) {
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                    return !unmatchedWords.length;
                });
            }
        }
    }
    // Filter out any row that doesn't match the filter phrases
    Object.entries(filterObj).forEach(([key, filter]) => {
        let previousFilter = JSON.parse(JSON.stringify(filter));
        filterObj[key].isRegex = false;
        filterObj[key].isCustom = false;
        if (filter.value?.length) {
            // By default filter continues after a custom filter
            let customFilterContinue = true;
            let correspondingInstruct = instructs.find(d => d.key === key);
            if (typeof (correspondingInstruct?.userFunctions?.customFilter ?? null) === 'function' && correspondingInstruct?.userFunctions?.customFilter !== undefined) {
                let customFilterResult = correspondingInstruct.userFunctions.customFilter(matchedData, filter.value);
                matchedData = customFilterResult.data;
                customFilterContinue = customFilterResult.continue;
                filterObj[key].isCustom = !customFilterContinue;
            }
            if (customFilterContinue !== false) {
                let regexParts = getRegexParts(filter.value);
                if (regexParts) {
                    // If the regex format is invalid (e.g. wrong flags), revert to literal search
                    try {
                        let flags = regexParts.flags;
                        filterObj[key].isRegex = true;
                        // Unless all flags are just being deleted from a regex, add the default flags
                        if (!regexParts?.flags && !previousFilter.isRegex && filterObj[key]?.value) {
                            flags = options.defaultRegexFlags;
                            filterObj[key].value += flags;
                        }
                        // @ts-ignore Shhhh!
                        matchedData = matchedData.filter(d => new RegExp(regexParts.pattern, flags).test(d[key]));
                    }
                    catch (e) { }
                }
                if (!filter.isRegex) {
                    let words = filter.value.trim().toLowerCase().match(/\S+/g);
                    // Iterate over the rows and remove the matching words from unmatchedWords
                    matchedData = matchedData.filter(d => {
                        let unmatchedWords = Object.assign([], words);
                        let searchableString = d?.[key]?.toString()?.toLowerCase();
                        unmatchedWords = unmatchedWords.filter((word) => {
                            if (searchableString?.indexOf(word) > -1) {
                                return false;
                            }
                            return true;
                        });
                        return !unmatchedWords.length;
                    });
                }
            }
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
        // Slice the rows of the current page
        pageData = sortedData.slice(p.firstShownRow - 1, p.lastShownRow);
    }
    else {
        pageData = sortedData;
    }
    if (typeof (options.userFunctions?.customParse ?? null) === 'function' && options.userFunctions?.customParse !== undefined) {
        formattedPageData = options.userFunctions.customParse(JSON.parse(JSON.stringify(pageData)));
    }
    else {
        formattedPageData = JSON.parse(JSON.stringify(pageData));
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
    dispatch('rowClicked', { event: e, data: pageData[index] });
    if (e.target.dataset?.name === 'edit-submit') {
        let textareaEls = e.target.closest('tr')?.querySelectorAll('textarea[data-name=edit-textarea]');
        textareaEls.forEach(textareaEl => {
            data[pageData[index][dataIdKey]][textareaEl?.dataset?.key ?? ''] = textareaEl?.value ?? '';
        });
        data[pageData[index][dataIdKey]][checkboxKey] = false;
        initialize(instructs, options, data);
    }
}
function rowDblClicked(e, index) {
    dispatch('rowDblClicked', { event: e, data: pageData[index] });
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
    initialize(instructs, options, data);
}
export function selectAllAction(e) {
    closeMenu(e);
    data = data.map(row => {
        row[checkboxKey] = true;
        return row;
    });
    initialize(instructs, options, data);
}
export function selectNoneAction(e) {
    closeMenu(e);
    data = data.map(row => {
        delete row[checkboxKey];
        return row;
    });
    initialize(instructs, options, data);
}
export function invertSelectionAction(e) {
    closeMenu(e);
    data = data.map(row => {
        row[checkboxKey] = !row[checkboxKey];
        return row;
    });
    initialize(instructs, options, data);
    ;
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
    initialize(instructs, options, data);
}
export function deleteAction(e) {
    closeMenu(e);
    data = data.filter(row => {
        return !row[checkboxKey];
    });
    initialize(instructs, options, data);
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
        search: searchObj,
        filters: filterObj
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
                            <input data-name="search-input" type="text" placeholder=" " data-is_regex={searchObj.isRegex} data-is_custom={searchObj.isCustom} bind:value={searchObj.value} on:input={renderTable}>
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
                                                        <input data-key={instruct.key} data-is_regex={filterObj[instruct.key].isRegex} data-is_custom={filterObj[instruct.key].isCustom} placeholder="Filter by {instruct.title}" bind:value={filterObj[instruct.key].value} on:input={renderTable} >
                                                    {/if}
                                                </th>
                                            {/if}
                                        {/each}
                                    </tr>
                                {/if}
                            </thead>
                            <tbody>
                                {#if formattedPageData.length}
                                    {#each formattedPageData as record, index}
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
                                                            <div data-name="edit-block">
                                                                <textarea data-name="edit-textarea" data-key={instruct.key}>{data[record[dataIdKey]][instruct.key]}</textarea>
                                                                <button data-name="edit-submit">✔️</button>
                                                            </div>
                                                        {:else if instruct?.parseAs === 'unsafe-html'}
                                                            {@html (record[instruct.key] ?? '')}
                                                        {:else}
                                                            {(record[instruct.key] ?? '')}
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
                                                        <input data-key={instruct.key} data-is_regex={filterObj[instruct.key].isRegex} data-is_custom={filterObj[instruct.key].isCustom} placeholder="Filter by {instruct.title}" bind:value={filterObj[instruct.key].value} on:input={renderTable} >
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
