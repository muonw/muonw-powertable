<script lang="ts">
import { onMount } from "svelte"
import type { SvelteComponent } from "svelte"
import data from '../../../data/jobs.json';
import PowerTable, {getRegexParts, type RegexParts} from '$lib/components/PowerTable.svelte';
import type {Instructs, Options, Data} from '$lib/components/PowerTable.svelte';

let myPowerTable: SvelteComponent;
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
    // To allow rendering of those span tags, parseAs should be set to 'unsafe-html'
    let tempInstructs: Instructs[] = [];
    Object.keys(data[0]).forEach(key => {
        tempInstructs.push({
            key: key,
            title: key,
            parseAs: 'unsafe-html',
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
    pageContent = highlighter(pageContent, myPowerTable, ptInstructs);
    return pageContent;
}



// ====================================================================
// The code below could be moved to a separate file (e.g. highlight.ts)
// ====================================================================

// Assigning numbers to types of matches (search matches, filter matches, overlapping search and filter matches)
const SEARCH_SEGMENT_TYPE: number = 1;
const FILTER_SEGMENT_TYPE: number = 2;
const OVERLAP_SEGMENT_TYPE: number = 3;

// HTML tags to be used for highlighting the matched phrases
let tags = {
    [SEARCH_SEGMENT_TYPE]: {
        open: `<span class="search-match">`,
        close: `</span>`,
    },
    [FILTER_SEGMENT_TYPE]: {
        open: `<span class="filter-match">`,
        close: `</span>`,
    },
    [OVERLAP_SEGMENT_TYPE]: {
        open: `<span class="overlap-match">`,
        close: `</span>`,
    }
}

type Segment = {
    startChar: number,
    endChar: number,
    type: number
}

type Matches = {
    [_: string]: number[]
}[];

export function highlighter(pageContent: Data[], ptRef: SvelteComponent, ptInstructs: Instructs[]): Data[] {
    if (ptRef?.getData){
        let searchMatches = locateMatches(pageContent, ptRef, ptInstructs);
        pageContent = highlightMatches(pageContent, searchMatches, ptInstructs);
    }
    return pageContent;
}

// This function creates an array of all matched character for each entry
function locateMatches(pageContent: Data[], ptRef: SvelteComponent, Instructs: Instructs[]): Matches {
    let searchPhrase: string;
    let searchIsRegex: boolean;
    let filters: Record<string, {
        value: string,
        isRegex: boolean
    }> = {};
    let matches: Matches = [];
    
    // Since the component is mounted, the current search and filter phrases will be retrieved using the getData function
    let currentData = ptRef.getData();
    searchPhrase = currentData.search?.value ?? '';
    searchIsRegex = currentData.search?.isRegex ?? false;
    Instructs.forEach(instruct => {
        filters[instruct.key] = {
            value: currentData.filters[instruct.key]?.value ?? '',
            isRegex: currentData.filters[instruct.key]?.isRegex ?? false
        };
    });

    let flags: string | undefined;
    let regexParts: RegexParts | false;

    // Locating the search phrase matches
    if (searchPhrase) {
        let searchRegex = new RegExp('');

        if (searchIsRegex === false) {
            // Creating a Regex safe version of the search phrase
            let pattern = searchPhrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').trim();
            // The non-RegEx search method looks for each word, not the exact phrase
            let words = pattern.toLowerCase().match(/\S+/g);
            if (words?.length) {
                pattern =  words.join('|') ;
            }

            searchRegex = new RegExp(pattern, 'gi');
        }
        else {
            regexParts = getRegexParts(searchPhrase);
            if (!regexParts) { throw new Error('RegEx is not valid!'); }
            flags = regexParts?.flags ?? '';
            searchRegex = new RegExp(regexParts.pattern, flags);
        }

        pageContent.forEach((row, rowIndex) => {
            Instructs.forEach((instruct, instructIndex) => {
                let curMatches: any[] = [];
                // Global flag is required for matchAll
                if (searchIsRegex === false || flags?.indexOf('g') !== -1) {
                    curMatches = [...row[instruct.key].matchAll(searchRegex)];
                } else {
                    curMatches = [row[instruct.key].match(searchRegex)];
                }
                
                if (curMatches?.length) {                       
                    if (!matches[rowIndex]) {
                        matches[rowIndex] = {};
                    }
                    if (!matches[rowIndex][instruct.key]) {
                        matches[rowIndex][instruct.key] = [];
                    }

                    curMatches.forEach(match => {
                        if (match){
                            for (let i = match.index; i < match.index + match[0].length; i++) {
                                matches[rowIndex][instruct.key][i] = SEARCH_SEGMENT_TYPE;
                            }
                        }
                    });
                } 
            });
        });
    }

    // Locating the filter phrase matches
    let filterRegex = new RegExp('');

    Instructs.forEach((instruct, instructIndex) => {
        if (filters[instruct.key]?.value) {
            if (filters[instruct.key].isRegex === false) {
                // Creating a Regex safe version of the search phrase
                let pattern = filters[instruct.key].value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').trim();
                // The non-RegEx filter method looks for each word, not the exact phrase
                let words = pattern.toLowerCase().match(/\S+/g);
                if (words?.length) {
                    pattern =  words.join('|') ;
                }
                filterRegex = new RegExp(pattern, 'gi');
            } else {
                regexParts = getRegexParts(filters[instruct.key].value);
                if (!regexParts) { throw new Error('RegEx is not valid!'); }
                flags = regexParts?.flags ?? '';
                filterRegex = new RegExp(regexParts.pattern, flags);
            }

            pageContent.forEach((row, rowIndex) => {
                let curMatches: any[] = [];
                // Global flag is required for matchAll
                if (filters[instruct.key].isRegex === false || flags?.indexOf('g') !== -1) {
                    curMatches = [...row[instruct.key].matchAll(filterRegex)];
                } else {
                    curMatches = [row[instruct.key].match(filterRegex)];
                }
                
                if (curMatches.length) {                       
                    if (!matches[rowIndex]) {
                        matches[rowIndex] = {};
                    }
                    if (!matches[rowIndex][instruct.key]) {
                        matches[rowIndex][instruct.key] = [];
                    }

                    curMatches.forEach(match => {
                        if (match){
                            for (let i = match.index; i < match.index + match[0].length; i++) {
                                if (matches[rowIndex][instruct.key][i] ?? null) {
                                    matches[rowIndex][instruct.key][i] = OVERLAP_SEGMENT_TYPE;
                                } else {
                                    matches[rowIndex][instruct.key][i] = FILTER_SEGMENT_TYPE;
                                }
                            }
                        }
                    });
                } 
            });
        }
    });

    return matches;
}


// This function wraps the matches inside appropriate HTML tags
function highlightMatches(pageContent: Data[], matches: Matches, Instructs: Instructs[]) {
    let typesArray: number[] = [];
    
    pageContent.forEach((rowData, rowIndex) => {
        Instructs.forEach(instruct => {
            if (typesArray = matches[rowIndex]?.[instruct.key]) {
                let tagType = -1;
                let segment: Segment = {
                    startChar: -1,
                    endChar: -1,
                    type: -1
                };
                let segments: Segment[] = [];
                let lastIndex: number = 0;

                typesArray.forEach((type, index) => {                    
                    // If this is the first segment
                    if (tagType === -1) {
                        segment = {
                            startChar: index,
                            endChar: index,
                            type: type,
                        }
                    }
                    // If there is a non-matching gap
                    else if (index - lastIndex> 1) {
                        segments.push({
                            ...segment,
                            endChar: lastIndex
                        });

                        segment = {
                            startChar: index,
                            endChar: index,
                            type: type,
                        }
                    }
                    // If this is a different segment type
                    else if (type != tagType) {
                        segments.push({
                            ...segment,
                        });

                        segment = {
                            startChar: index,
                            endChar: index,
                            type: type,
                        }
                    }
                    // If this is the same segment type
                    else {
                        segment.endChar = index;
                    }

                    tagType = type;
                    lastIndex = index;
                });

                // If there is any unclosed segments
                if (segment.type > 0) {
                    segments.push(segment);
                }

                segments = segments.sort((a,b) => b.startChar - a.startChar);
                
                segments.forEach(segment => {
                    rowData[instruct.key] = [
                        rowData[instruct.key].slice(0, segment.startChar),
                        tags[segment.type].open,
                        rowData[instruct.key].slice(segment.startChar, segment.endChar + 1),
                        tags[segment.type].close,
                        rowData[instruct.key].slice(segment.endChar + 1),
                    ].join('');
                });
            }
        });
    });

    return pageContent;
}
</script>


<div class="ex8_style1">
    <PowerTable {ptData} {ptInstructs} {ptOptions} bind:this={myPowerTable} />
</div>

<style lang="scss">
$light_root: (
    --colors-search-match-background: #ffe300,
    --colors-filter-match-background: #8ed3fc,
    --colors-overlap-match-background: #adf05d,
);

$dark_root: (
    --colors-search-match-background: #736600,
    --colors-filter-match-background: #0b679d,
    --colors-overlap-match-background: #4e8809,
);

:root, :root[data-color-scheme=light] {
    @each $key, $val in $light_root {
        #{$key}: $val;
    }
}

@media screen and (prefers-color-scheme: dark) {
    :root {
        @each $key, $val in $dark_root {
            #{$key}: $val;
        }
    }
}

:root[data-color-scheme=dark] {
    @each $key, $val in $dark_root {
        #{$key}: $val;
    }
}

:global(.ex8_style1 th[data-key=id]){
    width: 50px;
}
:global(.ex8_style1 td[data-key=id] textarea){
    width: 40px ;
}
:global(.ex8_style1 span.search-match){
    background-color: var(--colors-search-match-background);
}
:global(.ex8_style1 span.filter-match){
    background-color: var(--colors-filter-match-background);
}
:global(.ex8_style1 span.overlap-match){
    background-color: var(--colors-overlap-match-background);
}
</style>