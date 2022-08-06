import { SvelteComponentTyped } from "svelte";
export interface Instructs {
    key: string;
    title?: string;
    sortable?: boolean;
    sortCaseSensitive?: boolean;
    filterable?: boolean;
    filterPhrase?: string;
    filterIsRegex?: boolean;
    parseAs?: 'text' | 'unsafe-html';
    userFunctions?: {
        customSort?(v1: string, v2: string): number;
        customFilter?(data: Data[], searchPhrase: string): {
            data: Data[];
            continue: boolean;
        };
    };
}
export interface Data {
    [_: string]: any;
}
declare type SortString = '' | 'asc' | 'desc';
export interface Options {
    uniquePrefix?: string;
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    paginationBlock?: 3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19;
    headerText?: boolean;
    footerText?: boolean;
    headerFilters?: boolean;
    footerFilters?: boolean;
    headerLoadingBar?: boolean;
    footerLoadingBar?: boolean;
    defaultRegexFlags?: string;
    nestedSorting?: boolean;
    isDataRemote?: boolean;
    totalRows?: number | null;
    filteredRows?: number | null;
    currentPage?: number;
    searchPhrase?: string;
    searchIsRegex?: boolean;
    checkboxColumn?: boolean;
    userFunctions?: {
        dataFeed?(data: Record<string, any>): Promise<DataFeed>;
        customParse?(data: Data[]): Data[];
        customSearch?(data: Data[], searchPhrase: string): {
            data: Data[];
            continue: boolean;
        };
    };
    segments?: Record<string, Array<'settings' | 'search' | 'pagination' | 'table' | 'dropdown' | 'stats'>>;
    sortOrder?: {
        [k in SortString]?: SortString;
    };
}
export interface DataFeed {
    instructs?: Instructs[];
    options?: Options;
    data?: Data[];
}
export declare type RegexParts = {
    delimiter: string;
    pattern: string;
    flags: string;
};
declare type Lookup = {
    value?: string;
    isRegex?: boolean;
    isCustom?: boolean;
};
export declare let dataIdKey: string;
export declare let checkboxKey: string;
export declare function getRegexParts(phrase: string): false | RegexParts;
declare const __propDef: {
    props: {
        ptInstructs?: Instructs[] | undefined;
        ptOptions?: Options | undefined;
        ptData?: Data[] | undefined;
        closePopUps?: (({ target }: MouseEvent) => void) | undefined;
        closeMenu?: ((e: MouseEvent) => void) | undefined;
        toggleMenu?: ((e: MouseEvent) => void) | undefined;
        toggleCheckboxColumn?: ((e: MouseEvent) => void) | undefined;
        selectAllAction?: ((e: MouseEvent) => void) | undefined;
        selectNoneAction?: ((e: MouseEvent) => void) | undefined;
        invertSelectionAction?: ((e: MouseEvent) => void) | undefined;
        addAction?: ((e: MouseEvent) => void) | undefined;
        deleteAction?: ((e: MouseEvent) => void) | undefined;
        getData?: ((removeMetadata?: boolean) => {
            options: Options;
            instructs: Instructs[];
            data: Data[];
            search: Lookup;
            filters: Record<string, Lookup>;
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
    get closePopUps(): ({ target }: MouseEvent) => void;
    get closeMenu(): (e: MouseEvent) => void;
    get toggleMenu(): (e: MouseEvent) => void;
    get toggleCheckboxColumn(): (e: MouseEvent) => void;
    get selectAllAction(): (e: MouseEvent) => void;
    get selectNoneAction(): (e: MouseEvent) => void;
    get invertSelectionAction(): (e: MouseEvent) => void;
    get addAction(): (e: MouseEvent) => void;
    get deleteAction(): (e: MouseEvent) => void;
    get getData(): (removeMetadata?: boolean) => {
        options: Options;
        instructs: Instructs[];
        data: Data[];
        search: Lookup;
        filters: Record<string, Lookup>;
    };
}
export {};
