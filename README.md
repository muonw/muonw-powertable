[![MuonW PowerTable](https://github.com/muonw/powertable/raw/main/src/data/powertable_basic.png)](https://muonw.github.io/powertable/examples)

# [▦](https://muonw.github.io/powertable/) PowerTable

PowerTable is a JavaScript component that turns JSON data into an interactive HTML table. This facilitates manual inspection, sorting, filtering, searching, and editing of the data. 

## ✨ Features

- No runtime dependencies
- Sorting (single- and multi-column)
- Filtering (per column and global. RegEx)
- Re-arrangeable layout segments
- Optional styling
- Custom parsing per column
- Usable as Svelte component or ES module

## ⚡️ Quick start

### For Svelte projects

First, install with Node Package Manager (NPM):

```sh
npm i muonw/powertable
```

Then, import in your svelte file (e.g. src/routes/index.svelte):

```javascript
<script>
import { PowerTable } from '@muonw/powertable/src/lib';
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];
</script>

<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>
```

### For non-Svelte projects

Import the bundled ES Module from [JsDelivr CDN](https://cdn.jsdelivr.net/gh/muonw/powertable/package/dist/powertable.js) in your HTML file (e.g. index.html).

```javascript
<div class="MuonW PowerTable">
    <div id="table1"></div>
</div>

<script type="module">
import { PowerTable } from 'https://cdn.jsdelivr.net/gh/muonw/powertable/package/dist/powertable.js'
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];

const myTable = new PowerTable({
    target: document.getElementById('table1'),
    props: { ptData }
});
</script>
```
Integration with JavaScript frameworks (e.g. React, Vue, etc.) may require steps that are not covered in this repository. Please see [this example that demonstrates a basic usage with React](https://muonw.github.io/powertable/manual/react.md).

## 👀 Examples

To see the live demos, visit https://muonw.github.io/powertable/examples

## 📖 Manual

### Props

The `PowerTable` component accepts three optional props: `ptInstructs`, `ptOptions`, and `ptData`.

```html
<PowerTable {ptInstructs} {ptOptions} {ptData} />
```

The prop `ptInstructs` is an array of objects that sets the column attributes. All properties except for `key` are optional.

Example:

```javascript
let ptInstructs = [
    {key: 'id'},
    {key: 'name', title: 'Full Name', render: myFunction},
    {key: 'gender', title: 'Gender', sortable: false},
];
```

| Property | Type | Default | Example | Description |
| -------- | ---- | ------- | ------- | ----------- |
|  `key`  | string | | "id" | A unique string representing the column |
| `title` | string | [value of `key`] | "ID" | The displayed string on the header of the column |
| `sortable` | boolean | true | true | Specifies if the column is sortable |
| `filterable` | boolean | true | true | Specifies if the column can be filtered |
| `filterPhrase` | string | "" | "Alex" | The default filter phrase for the column |
| `isRegex` | boolean | false | false | Specifies if the default filterPhrase of the column is Regex |
| `parse` | 'text'\| 'unsafe-html' | 'text' | 'unsafe-html' | If set to 'unsafe-html', HTML tags will be rendered (without sanitization) |
| `render` | function | | (e)=>e+'\<br\>' | A user defined function to intercept and modify the contents of the column |

The prop `ptOptions` is an object that allows adjusting various features of the table. All properties are optional.

Example:

```javascript
let ptOptions = {
    uniquePrefix: 'myTable1',
    rowsPerPageOptions: [10, 100, 200],
    footerText: false,
    footerFilters: false,
}
```

| Property | Type | Default | Example | Description |
| -------- | ---- | ------- | ------- | ----------- |
| `uniquePrefix` | string | "" | "pt1" | A unique string assigned to each instance of the table, when including multiple instances in the same page |
| `rowsPerPageOptions` | number[] | [5, 10, 20, 50, 100] | [10, 100] | An array of integers to specify the possible number of displayed rows per page |
| `rowsPerPage` | number | 10 | 10 | The default number of displayed rows per page |
| `paginationBlock` | 3\|5\|7\|9\|11\|13\|15\|17\|19 | 3 | 3 | The middle numbers in the pagination that fall between the right and left ellipsis ('...') |
| `headerText` | boolean | true | true | Specifies whether header titles should be displayed |
| `footerText` | boolean | true | true | Specifies whether footer titles should be displayed |
| `headerFilters` | boolean | true | true | Specifies whether header filter text fields should be displayed |
| `footerFilters` | boolean | true | true | Specifies whether footer filter text fields should be displayed |
| `headerLoadingBar` | boolean | true | true | Specifies whether header loading bar should be displayed while loading remote data |
| `footerLoadingBar` | boolean | true | true | Specifies whether footer loading bar should be displayed while loading remote data |
| `defaultRegexFlags` | string | 'gimsu' | 'gi' | The default RegEx flags. Cannot be empty |
| `nestedSorting` | boolean | false | true | Specifies whether nested/multi-column sorting is enabled |
| `isDataRemote` | boolean | false | true | Specifies whether data is fetched from a URL |
| `totalRows` | number \| null | null | 150 | An integer to specify the total number of rows in the table when displaying remote data |
| `filteredRows` | number \| null | null | | |
| `currentPage` | number | 1 | 1 | The number of the displayed page |
| `dataFeedFunction` | function | async () => ({}) | myApiCall | When `isDataRemote` is `true`, the output of this function will be used as `ptData` prop |
| `searchPhrase` | string | "" | "apple" | The default search phrase |
| `searchIsRegex` | boolean | false | false | Specifies whether the default search phrase is RegEx |
| `checkboxColumn` | boolean | false | true | Specifies whether the checkbox selection column should be displayed |
| `segments` | [see below] | [see below] | [see below] | [see below] |
| `sortOrder` | [see below] | [see below] | [see below] | [see below] |

```
segments: {
    'topBar': ['search', 'pagination'],
    'pTable': ['table'],
    'bottomBar': ['dropdown', 'stats', 'pagination'],
},
nestedSorting: false,
sortOrder: {
    '': 'asc',
    'asc': 'desc',
    'desc': '',
},
```

[More information will be provided here]


## 🎯 Objectives
This repository exists to develop and maintain a tool that fulfills the following requirements:
- Is based on Svelte.
- Is easy to learn and use.
- Runs in latest versions of Chrome, Firefox, and Safari.
- Does not include a web server.
- Does not apply CSS styles by default.
- Does not include third party runtime dependencies.
- Displays structured JSON data in an HTML table that...
    - is easy to navigate with mouse and/or keyboard.
    - is easy to interact with on a desktop monitor.
    - renders 1000+ rows without noticeable delay.
    - can display and modify remote data.

## 📝 To-do 

- [ ] Fetch remote data
- [ ] In place editing

## 💻 Contribution

Areas of high priority:
- To-do items
- Code quality
- Accessibility
- Tests
