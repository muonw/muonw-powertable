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
import { PowerTable } from '@muonw/powertable';
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];
</script>

<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>

<style global>
@import '../../node_modules/@muonw/powertable/package/dist/power-table.css';
</style>
```

### For non-Svelte projects

Paste the code below in your HTML file (e.g. index.html).

```javascript
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/muonw/powertable/package/dist/power-table.css">

<div class="MuonW PowerTable">
    <div id="table1"></div>
</div>

<script type="module">
import { PowerTable } from 'https://cdn.jsdelivr.net/gh/muonw/powertable/package/dist/power-table.js'
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];

const myTable = new PowerTable({
    target: document.getElementById('table1'),
    props: { ptData }
});
</script>
```
Integration with JavaScript frameworks (e.g. React, Vue, etc.) may require steps that are not covered in this repository. Please see [this example that demonstrates a basic usage with React](https://github.com/muonw/powertable/blob/main/docs/manual/react.md).

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

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
|  `key`  | string | | A unique string representing the column |
| `title` | string | [value of `key`] | Text displayed on column's header |
| `sortable` | boolean | true | Whether the column is sortable |
| `filterable` | boolean | true | Whether the column can be filtered |
| `filterPhrase` | string | "" | The column's default filter phrase |
| `isRegex` | boolean | false | Whether the default filterPhrase is Regex |
| `parse` | 'text'\| 'unsafe-html' | 'text' | If set to 'unsafe-html', HTML tags will be rendered (without sanitization) |
| `render` | function | | A user defined function to intercept and modify the contents of the column |

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

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `uniquePrefix` | string | "" | "pt1" | A unique string for each table instance |
| `rowsPerPageOptions` | number[] | [5, 10, 20, 50, 100] | Possible number of displayed rows per page |
| `rowsPerPage` | number | 10 | Default number of displayed rows per page |
| `paginationBlock` | 3\|5\|7\|9\|11\| 13\|15\|17\|19 | 3 | Pagination length excluding the first and last page |
| `headerText` | boolean | true | Whether to show header titles |
| `footerText` | boolean | true | Whether to show footer titles |
| `headerFilters` | boolean | true | Whether to show header filter text fields |
| `footerFilters` | boolean | true | Whether to show footer filter text fields |
| `headerLoadingBar` | boolean | true | Whether to show header loading bar for remote data |
| `footerLoadingBar` | boolean | true | Whether to show footer loading bar for remote data |
| `defaultRegexFlags` | string | 'gimsu' | The default RegEx flags. Cannot be empty |
| `nestedSorting` | boolean | false | Whether the nested/multi-column sorting is enabled |
| `isDataRemote` | boolean | false | Whether the data is fetched from a URL |
| `totalRows` | number \| null | null | Total number of rows (when displaying remote data) |
| `filteredRows` | number \| null | | Number of filtered rows (when displaying remote data) |
| `currentPage` | number | 1 | The number of the displayed page |
| `dataFeedFunction` | function | async () => ({}) | When `isDataRemote` is `true`, the output of this function will be used as `ptData` prop |
| `searchPhrase` | string | "" | The default search phrase |
| `searchIsRegex` | boolean | false | Whether the default search phrase is RegEx |
| `checkboxColumn` | boolean | false | Whether to show checkbox selection column |
| `segments` | object | | [\[visit `segments` document\]](https://github.com/muonw/powertable/blob/main/docs/manual/segments.md) |
| `sortOrder` | object | | [\[visit `sortOrder` document\]](https://github.com/muonw/powertable/blob/main/docs/manual/sortorder.md) |

The prop `ptData` is an array of objects containing the data to be displayed in the table. The property names must match the value of the `key` properties in `ptInstructs`.All property values including boolean, number, object, and array values will be converted to string.

Example:

```javascript
let ptData = [
    {"id": 1, "name": "Fay"},
    {"id": 2, "name": "Luca"}
];
```

### Events

The events `rowClicked` or `rowDblClicked` will be dispatched when a row is clicked or double clicked, respectively. Both return an object with a property named `event` containing the mouse event, and `data` containing the row data from `ptData`.

```html
<PowerTable
    {ptData}
    on:rowClicked="{(d) => console.log('click', d)}"
    on:rowDblClicked="{(d) => console.log('dblclick', d)}"
/>
```

### Slots

Named slots can be used to override some default HTML elements.

Example:

```html
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

### Styles

You can add styling with CSS or SCSS.

**With CSS:**

```html
<style global>
@import '../../node_modules/@muonw/powertable/package/dist/power-table.css';
</style>
```

**With SCSS:** The default styling can be applied by importing `package/styles/power-table.scss` and [Mascara](https://github.com/muonw/mascara) in your layout (i.e. `routes/__layout.svelte`).

```html
<style lang="scss" global>
@import '../../node_modules/@muonw/mascara/package/styles/main.scss';
@import '../../node_modules/@muonw/powertable/package/styles/power-table.scss';

/* To make search and filter text boxes smaller */
.MuonW.PowerTable {
    tr[data-name=filters-tr] {
        input{
            @extend .compact;
        }
    }
    div[data-name=search-container]{
        input[data-name=search-input]{
            @extend .medium;
        }
    }
}
</style>
```

For more detailed implementations, see the examples at https://muonw.github.io/powertable/examples

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
