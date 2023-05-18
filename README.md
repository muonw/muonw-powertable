<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muonw/muonw-powertable/v2.0.0/src/data/muonw_powertable_830x495_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muonw/muonw-powertable/v2.0.0/src/data/muonw_powertable_830x495_light.png">
  <img alt="MuonW PowerTable" src="https://raw.githubusercontent.com/muonw/muonw-powertable/v2.0.0/src/data/muonw_powertable_830x495_light.png">
</picture>


# [▦](https://github.com/muonw/muonw-powertable) PowerTable

PowerTable is a Svelte component that turns JSON data into an interactive HTML table. This facilitates manual inspection, sorting, filtering, searching, and editing of the data. PowerTable is inspired by DataTables and powered by Svelte.

## ✨ Features

- No runtime dependencies
- Sorting (single- and multi-column + custom sorting)
- Filtering (per column and global + RegEx + custom filtering)
- Inline editing
- Re-arrangeable layout segments
- Optional styling
- Custom parsing
- Local and remote data source

## ⚡️ Quick start

First, set the correct node package registry for @muonw packages:

```sh
npm config set @muonw:registry https://node.pkgreg.com/ -L project
```

Then, install the package:

```sh
npm i -D @muonw/powertable
```

Now, you can import the component in your svelte files (e.g. `src/routes/+page.svelte`). Here is an example of a basic implementation in an SvelteKit project without any styling (styles can be added by uncommenting the import lines):

```svelte
<script>
import { PowerTable } from '@muonw/powertable';
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];

// Uncomment to add basic styling. Requires installing saas (i.e. npm install -D sass)
// import '@muonw/powertable/styles/power-table.scss';

// Uncomment if using @muonw/mascara (https://github.com/muonw/muonw-mascara)
// import '@muonw/powertable/styles/power-table-mascara.scss';
</script>

<PowerTable {ptData} />
```

## 👀 Examples

To see the demos, visit https://muonw.github.io/muonw-powertable/examples/example1

## 📖 Manual

### Props

The `PowerTable` component accepts three optional props: `ptInstructs`, `ptOptions`, and `ptData`.

```svelte
<PowerTable {ptInstructs} {ptOptions} {ptData} />
```

❶ The prop `ptInstructs` is an array of objects that sets the column attributes. All properties except for `key` are optional.

Example:

```javascript
let ptInstructs = [
    {key: 'id'},
    {key: 'name', title: 'Full Name'},
    {key: 'gender', title: 'Gender', sortable: false},
];
```

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `key`  | string | | A unique string representing the column |
| `title` | string | [value of `key`] | Text displayed on column's header |
| `sortable` | boolean | true | Whether the column is sortable |
| `sortCaseSensitive` | boolean | false | Whether sorting should be case sensitive |
| `filterable` | boolean | true | Whether the column can be filtered |
| `filterPhrase` | string | "" | The column's default filter phrase |
| `filterIsRegex` | boolean | false | Whether the default filterPhrase is Regex (for remote data) |
| `parseAs` | 'text' \| 'html' \| 'unsafe-html' | 'text' | 'html' allows rendering of `<div>`, `<span>`, `<code>`, `<strong>`, `<b>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<u>`, `<i>`, `<em>`, `<sup>`, and `<sub>` tags with an optional `class` attribute. If a tag doesn't match this criteria, only its content will be displayed. If set to 'unsafe-html', all HTML tags will be rendered without any [sanitization](https://en.wikipedia.org/wiki/HTML_sanitization) |
| `userFunctions` | object | | [See Below] |

The `userFunctions` property in `ptInstructs` prop is an object that can contain the following user-defined function(s).

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `customSort` | function | | Overrides the sorting process |
| `customFilter` | function | | A user-defined function to override the filtering process |

The value of `customSort` should be a function that receives two string values (v1 and v2) and returns a number indicating the order of those values: `-1` if v1 < v2, `1` if v1 > v2, `0` if v1 == v2

The value of `customFilter` should be a function that returns a slice of `ptData` after applying a filter. The function will receive the `ptData`.

<b id="special-instructs">❗ Special instructs:</b> There are two special instructs that will be added to the underlying instructs and data objects for internal use (e.g. keeping track of the id and checkbox value of each row). In many cases, when accessing or altering a row data in a user-defined function, you should exclude these instructs from the process. To do so, import the variables `dataIdKey` and `checkboxKey` and exclude any instruct whose `key` matches the value of those variables.  

❷ The prop `ptOptions` is an object that allows adjusting various features of the table. All properties are optional.

Example:

```javascript
let ptOptions = {
    uniquePrefix: 'myTable1',
    rowsPerPageOptions: [10, 100, 200],
    footerText: false,
    footerFilters: false,
}
```

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uniquePrefix` | string | "" | A unique string representing a table instance |
| `rowsPerPageOptions` | number[] | [5, 10, 20, 50, 100] | Possible number of displayed rows per page |
| `rowsPerPage` | number | 10 | Default number of displayed rows per page |
| `paginationBlock` | 3\|5\|7\|9\|11\| 13\|15\|17\|19 | 3 | Pagination length excluding the first and last page |
| `headerText` | boolean | true | Whether to show header titles |
| `footerText` | boolean | true | Whether to show footer titles |
| `headerFilters` | boolean | true | Whether to show header filter text fields |
| `footerFilters` | boolean | true | Whether to show footer filter text fields |
| `headerLoadingBar` | boolean | true | Whether to show header loading bar for remote data |
| `footerLoadingBar` | boolean | true | Whether to show footer loading bar for remote data |
| `defaultRegexFlags` | string | 'gimsu' | The default RegEx flags |
| `nestedSorting` | boolean | false | Whether the nested/multi-column sorting is enabled |
| `isDataRemote` | boolean | false | Whether the data is fetched from a URL |
| `totalRows` | number \| null | null | Total number of rows (when displaying remote data) |
| `filteredRows` | number \| null | | Number of filtered rows (when displaying remote data) |
| `currentPage` | number | 1 | The number of the displayed page |
| `searchPhrase` | string | "" | The default search phrase |
| `searchIsRegex` | boolean | false | Whether the default search phrase is RegEx |
| `checkboxColumn` | boolean | false | Whether to show checkbox selection column |
| `translations` | object | | [See Below] |
| `userFunctions` | object | | [See Below] |
| `segments` | object | | [See Below] |
| `sortOrder` | object | | [See Below] |

The `translations` property in `ptOptions` prop is an object that can contain language-specific number format as well as the translations of various parts of the table. See the available options in the [source code](https://github.com/muonw/muonw-powertable/blob/main/app/src/routes/examples/example3/+page.svelte) of [Example 3: Custom Options](https://muonw.github.io/muonw-powertable/examples/example3).

The `userFunctions` property in `ptOptions` prop is an object that can contain the following user-defined functions.

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataFeed` | function | async () => ({}) | When `isDataRemote` is `true`, the output of this function will be used as `ptData` prop |
| `customParse` | function | | A user-defined function to intercept and modify the content of the current page |
| `customSearch` | function | | A user-defined function to override the search process |

❗ When retrieving data in a user-defined function, pay attention to the [special instructs](#special-instructs)!

The value of `dataFeed` should be a function that returns remote data (e.g. from and API). The function will receive an object (defined below) containing the information required to generate the props. 

The function received the following object:

```
{
    options = ➤ current options (same structure as `ptOptions`),
    search: {
        isRegex: ➤ true or false (boolean),
        value: ➤ the search phrase (string)
    },
    filters: {
        [➤ `ptInstruct` key]: {
            isRegex: ➤ true or false (boolean),
            value: ➤ the filter phrase
        },
        ...
    }
}
```
and should return the following object:

```
{
    instructs: ➤ Instructs to be used (same structure as ptInstructs),
    options: ➤ Options to be used (same structure as ptOptions),
    data: ➤ Data of the current page. Should be already searched, filtered, and sorted (same structure as ptData)
}
```

The value of `customParse` should be a function that returns the modified content of the current page. The function will receive a slice of the `ptData` that contains the current page's data.

The value of `customSearch` should be a function that returns a slice of `ptData` after performing search. The function will receive the `ptData`.


The `segments` property in `ptOptions` is an object that defines the top to bottom order of various HTML parts of PowerTable to facilitate theming and styling. Each property in this object will render a container DIV element with a `data-name` attribute equal to the property's arbitrary name and `data-type` equal to "segment". The value of each property is an array of HTML parts to be included in the container DIV element. Consider the following example:

```javascript
segments: {
    'myTopContainer': ['search', 'pagination'],
    'myTableContainer': ['table'],
}
```
That will translate to...

```html
<div data-name="myTopContainer" data-type="segment">
    [search bar HTML]
    [pagination HTML]
</div>

<div data-name="myTableContainer" data-type="segment">
    [table HTML]
</div>
```

The property names are arbitrary strings. The property values are as follows.

| value | Description |
| ----- | ----------- |
| "search" | Search bar |
| "pagination" | Pagination |
| "table" | The table block |
| "dropdown" | Dropdown menu for selecting the number of rows per page |
| "stats" | Representation of the displayed, filtered, and total number of rows |
| "settings" | Settings button |

The default value of `segments`:
```javascript
{
    'topBar': ['search', 'pagination'],
    'pTable': ['table'],
    'bottomBar': ['dropdown', 'stats', 'pagination'],
}
```

The `sortOrder` property in `ptOptions` prop is an object that specifies how the sorting direction will change. The property names represent the sorting direction before the click and their values represent the sorting direction after the click. When the value is an empty string, no sorting will be applied.

| name/value | Description |
| ----- | ----------- |
| "asc" | Ascending (small to large) |
| "desc" | Descending (large to small) |
| "" | No sorting |

The default value of `sortOrder`:
```javascript
{
    '': 'asc',
    'asc': 'desc',
    'desc': '',
}
```

❸ The prop `ptData` is an array of objects containing the data to be displayed in the table. The property names must match the value of the `key` properties in `ptInstructs`. All property values including boolean, number, object, and array values will be converted to string.

Example:

```javascript
let ptData = [
    {"id": 1, "name": "Fay"},
    {"id": 2, "name": "Luca"}
];
```

### Events

The events `rowClicked` or `rowDblClicked` will be dispatched when a row is clicked or double clicked, respectively. Both return an object with a property named `event` containing the mouse event, and `data` containing the row data from `ptData`.

```svelte
<PowerTable
    {ptData}
    on:rowClicked="{(d) => console.log('click', d)}"
    on:rowDblClicked="{(d) => console.log('dblclick', d)}"
/>
```

### Slots

Named slots can be used to override some default HTML elements.

Example:

```svelte
<PowerTable {ptData}>
    <div slot="noResults">There is no records to show!</div>
    <div slot="rendering">Please wait while table is being rendered...</div>
    <div slot="settings">
        <div data-name="item">Toggle control column</div>
    </div>
</PowerTable>
```

| Slot name | Description |
| --------- | ----------- |
| noResults | Content to be shown when there are no rows in the table |
| rendering | Content to be shown when table is loading remote data |
| settings | Content to be shown in the setting menu |


### Functions

`getData`: once the component is mounted, `getData` can be called to retrieve the props as well as search and filter data. This function accepts two parameters. The first parameter is a boolean value that determines whether Special Instructs should be removed before returning data (default is `true`). The second parameter is an array that determines what properties should be returned (default is `['options','instructs','data','search','filters']`). This function returns the following object:

```
{
    options: ➤ current options (same structure as `ptOptions`),
    instructs: ➤ the instructs (same structure as `ptInstructs`),
    data: ➤ current contents (same structure as `ptData`),
    matchedData: ➤ data after applying search and filters,
    sortedData: ➤ data after applying sorting,
    pageData: ➤ data of the current page before applying custom parsing,
    formattedPageData: ➤ data of the current page after applying custom parsing,
    search: {
        isRegex: ➤ true or false (boolean),
        value: ➤ the search phrase (string)
    },
    filters: {
        [➤ `ptInstruct` key]: {
            isRegex: ➤ true or false (boolean),
            value: ➤ the filter phrase
        },
        ...
    }
}
```

`getRegexParts` receives a string RegEx and returns an object containing the RegEx delimiter, pattern, and flags as shown below. If the string is not a valid RegEx, `false` will be returned.

```
{
    delimiter: ➤ string,
    pattern: ➤ string,
    flags: ➤ string
}
```


## 🎯 Objectives
This repository exists to develop and maintain a tool that fulfills the following requirements:
- Displays structured JSON data in an HTML table that...
    - is easy to navigate with mouse and/or keyboard.
    - is easy to interact with on a desktop monitor.
    - renders 1000+ rows without noticeable delay.
    - can display and modify remote data.
- Is based on Svelte.
- Is easy to learn and use.
- Runs in latest versions of Firefox ESR, Chromium, and Safari.
- Does not impose a theme.
- Does not include a web server.
- Does not include third party runtime dependencies.

## 📝 To-do 

- [x] Fetch remote data
- [x] Inline editing
- [x] Improve search

## 💻 Contribution

Areas of high priority:
- Accessibility
- Code quality
- Tests

<hr>

License:

https://dev.muonw.com/license/muonw-0/