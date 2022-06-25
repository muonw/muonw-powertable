![MuonW PowerTable](https://github.com/muonw/powertable/raw/main/src/data/powertable_basic.png)

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

### 1. Installation

Install with Node Package Manager (NPM)

```sh
npm i muonw/powertable
```

Alternatively, if you don't use a package manager, download the bundled ES Module from [`package/dist/powertable.js`](https://raw.githubusercontent.com/muonw/powertable/main/package/dist/powertable.js)


### 2. Basic Usage

There are two options: If your project is based on Svelte, import the Svelte component. Otherwise, import the bundled JavaScript file.

**Svelte component**

<sup>The following is a Svelte file (e.g. src/routes/index.svelte).</sub>

```javascript
<script>
import { PowerTable } from '@muonw/powertable/src/lib';
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];
</script>

<div class="MuonW PowerTable">
    <PowerTable {ptData} />
</div>
```

**JavaScript bundle**

<sup>This is an HTML file (e.g. index.html).</sup>

```javascript
<div class="MuonW PowerTable">
    <div id="table1"></div>
</div>

<script type="module">
import { PowerTable } from '@muonw/powertable/package/dist/powertable.js'
let ptData= [{"id": 1, "name": "Fay"}, {"id": 2, "name": "Luca"}];

const myTable = new PowerTable({
    target: document.getElementById('table1'),
    props: { ptData }
});
</script>
```

## 👀 Examples

To see the live demos, visit https://muonw.github.io/powertable

## 📖 Manual

[more information will be provided here]

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
    - can fetch and modify remote data.

## 📝 To-do 

- [ ] Fetch remote data
- [ ] In place editing

## 💻 Contribution

Areas of high priority:
- To-do items
- Code quality
- Accessibility
- Tests
