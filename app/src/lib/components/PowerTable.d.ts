declare module '*.svelte' {
    export { SvelteComponentDev as default } from 'svelte/internal';
    export function highlighter(pageContent: Data[], ptRef: SvelteComponent, ptInstructs: Instructs[]): Data[];
    export function getRegexParts(phrase: string): false | RegexParts;
    export let dataIdKey: string;
    export let checkboxKey: string;
}