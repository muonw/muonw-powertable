import { SvelteComponentTyped } from "svelte";
export interface Instructs {
    key: string;
    title?: string;
    isRegex?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    filterPhrase?: string;
    render?(e: any): any;
    parse?: 'text' | 'unsafe-html';
}
declare type SortString = '' | 'asc' | 'desc';
export interface Options {
    uniquePrefix?: string;
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    totalRows?: number | null;
    currentPage?: number;
    paginationBlock?: 3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19;
    filteredRows?: number | null;
    headerText?: boolean;
    footerText?: boolean;
    headerFilters?: boolean;
    footerFilters?: boolean;
    headerLoadingBar?: boolean;
    footerLoadingBar?: boolean;
    defaultRegexFlags?: string;
    segments?: Record<string, Array<'settings' | 'search' | 'pagination' | 'table' | 'dropdown' | 'stats'>>;
    nestedSorting?: boolean;
    sortOrder?: {
        [k in SortString]?: SortString;
    };
    isDataRemote?: boolean;
    dataFeedFunction?(e: Record<string, any>): Promise<DataFeed>;
    searchIsRegex?: boolean;
    searchPhrase?: string;
    checkboxColumn?: boolean;
}
export interface Data {
    [_: string]: any;
}
export interface DataFeed {
    instructs?: Instructs[];
    options?: Options;
    data?: Data[];
}
declare const __propDef: {
    props: {
        ptInstructs?: Instructs[] | undefined;
        ptOptions?: Options | undefined;
        ptData?: Data[] | undefined;
        getData?: ((removeMetadata?: boolean) => {
            options: Options;
            instructs: Instructs[];
            data: Data[];
        }) | undefined;
    };
    events: {
        rowClicked: CustomEvent<any>;
        rowDblClicked: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        noResults: {};
        rendering: {};
        settings: {};
    };
};
export declare type PowerTableProps = typeof __propDef.props;
export declare type PowerTableEvents = typeof __propDef.events;
export declare type PowerTableSlots = typeof __propDef.slots;
export default class PowerTable extends SvelteComponentTyped<PowerTableProps, PowerTableEvents, PowerTableSlots> {
    get getData(): (removeMetadata?: boolean) => {
        options: Options;
        instructs: Instructs[];
        data: Data[];
    };
}
export {};
