<script>
import { page } from '$app/stores';

let pages = {
    1: 'Basic',
    2: 'Custom Instructs',
    3: 'Custom Options',
    4: 'Custom Slots',
    5: 'Styling',
    6: 'Remote Data',
    7: 'Editing & Controls',
    8: 'Filtering & Custom Parsing',
    9: 'Custom Sorting',
    10: 'Custom Filtering',
};
</script>

<nav>
    {#each Object.entries(pages) as [key, name]}
        <a
            href="/powertable/examples/example{key}"
            class:selected={$page.routeId === `examples/example${key}`}
        >
            {key}. {name}
        </a>
    {/each}
</nav>

{#if $page.routeIdMatches = new RegExp("^examples\/example([0-9]+)$", "g").exec($page.routeId)}
    <p class="setup-details">
        {#if $page.routeIdMatches[1] === '1'}
            This is a basic setup with no customizations.<br>
            ℹ️ Notice that when you sort the <b>Id</b> column, the order of the numbers is unusual (<code>1,10,100,...,2,20,200</code> instead of <code>1,2,3,4,5,6,...</code>). This is because by default columns are sorted alphabetically. To sort numbers, dates, and other data types, a <b>custom sorting</b> function can be used, as demonstrated in another example.
        {:else if $page.routeIdMatches[1] === '2'}
            Customizations of ptInstructs:<br>
            <b>1.</b> <b>Column titles</b> have been customized.<br>
            <b>2.</b> First name is <b>not sortable</b>.<br>
            <b>3.</b> Company has a <b>default filter phrase</b>.<br>
            <b>4.</b> Department is <b>not filterable</b>.<br>
            <b>5.</b> A custom parsing function has added <b>emojis and HTML tags</b> to some job titles.<br>
        {:else if $page.routeIdMatches[1] === '3'}
            There are two tables on this page separated by a horizontal line. The first table has the following customizations of ptOptions:<br>
            <b>1.</b> A <b>unique prefix</b> has been assigned to the table.<br>
            <b>2.</b> <b>Number of rows per page</b> can only be 3, 5, or 7.<br>
            <b>3.</b> <b>By default 3 rows</b> are displayed per page.<br>
            <b>4.</b> <b>Header filter</b> text boxes have been <b>removed</b>.<br>
            <b>5.</b> <b>Footer titles</b> have been <b>removed</b>.<br>
            <b>6.</b> <b>By default page #5</b> is displayed.<br>
            <b>7.</b> There are three <b>segments above the table</b>: dropdown, pagination, and stats.<br>
            <br>
            The second table does not have any customizations other than a unique prefix.
        {:else if $page.routeIdMatches[1] === '4'}
            Customizations with named slots:<br>
            <b>1.</b> A custom text is used for <b>noResults</b> slot.<br>
        {:else if $page.routeIdMatches[1] === '5'}
            Customizations of styles:<br>
            <b>1.</b> A <b>maximum height</b> is set for the table, creating a vertical scroll bar.<br>
            <b>2.</b> The height and color of the rows, and the direction of the id values have changed.<br>
        {:else if $page.routeIdMatches[1] === '6'}
            Table data can retrieve from an external source (e.g. an API). In this example, data will be processed using client side JavaScript with 500 milliseconds intentional delay to simulate fetching from a server. However, in real life scenarios, data is processed on a server (e.g. with PHP, Node, etc.). To simplify the example, some features such as search, filters, and sorting have been disabled.<br>
            Navigating to a different page of the table as well as any change in search/filter terms would trigger fetching new data.
        {:else if $page.routeIdMatches[1] === '7'}
            Controls can be used to access and manipulate the data with custom functions. To explore this feature, follow these steps:<br>
            <b>1.</b> Click on the <b>checkbox</b> at the beginning of a row to make the content of that row editable.<br>
            <b>2.</b> Edit some of the fields. Once a textarea is in focus, a button with a check mark (✔️) will appear next to it. Clicking on that button will submit the changes to <b>all the fields in that row</b>.<br>
            <b>3.</b> Once you finish editing the content of the row, click on one of the check mark buttons to save the changes. It doesn't matter which check mark button.<br>
            <b>4.</b> Click on the <b>gear icon</b> (⚙️) located on the header of the first column to explore the default options for <b>adding</b>, <b>deleting</b>, and <b>selecting</b> data. To delete a row, you first need to select it.<br>
            <b>5.</b> Click on the toolbox icon (🛠️) next to the search box and select "<b>Export current data</b>". The generated file reflects any changes you have made.<br>
        {:else if $page.routeIdMatches[1] === '8'}
            This table utilizes a user-defined function to highlight search/filter matches. Highlighting is an example of custom parsing — a feature that allows modifying the content of a page. Here, the <b>search matches</b> are depicted with a yellow highlight. <b>Filter matches</b> are blue, and the <b>overlaps</b> of search and filter matches are green.<br>
            ℹ️ Unlike <b>custom parsing</b> that relies on <b>user-defined</b> functions, <b>filtering and searching</b> are <b>built-in</b> features.<br>
            ℹ️ While both filter and search are designed to <b>filter</b> the data, their scopes are different. Filter applies to a single column, while search applies to the entire dataset.<br>
            ℹ️ By default, white-space characters and the order of the words in a search/filter phrase are ignored. For example the phrase <code>1 2</code> can match <code>12</code>, <code>21</code>, <code>102</code>, <code>1 2</code>, etc.<br>
            ℹ️ To look for an exact phrase match, or a complex pattern, use RegEx. For example <code>/1 2/</code> only matches <code>1 2</code>.<br>
            ℹ️ Once a RegEx expression is detected, the default RegEx flags and a distinctive styling (e.g. different text color) will be added to the filter phrase. This styling helps to visually confirm if RegEx is being used.<br>
            ℹ️ To search for a word or phrase that is a valid RegEx pattern (e.g. <code>/(^.^)*/</code>) but should not be interpreted as RegEx, add a space character before or after it.<br>
        {:else if $page.routeIdMatches[1] === '9'}
            This table utilizes user-defined functions to sort numbers, dates, and colors. Additionally, multi-column sorting has been enabled to fine-tune the sorting.<br>
            ℹ️ By default, columns can only be sorted alphabetically. This may not be desired for certain data types. For example, the numbers <code>1,100,11</code> are sorted alphabetically, while <code>1,11,100</code> is often the desired order. User-defined functions can override the default sorting behavior.<br>
            <b>1.</b> Click on the header of the <b>Score</b> column twice, so that the highest score would be on top.<br>
            <b>2.</b> Click on the header of the <b>Full Name</b> column to sort the names of the people who have the same score. Note that since multi-column sorting is enabled and scores are already sorted, sorting any additional column cannot cause any change in the score column. This means that only rows that have identical scores are free to be rearranged.<br>
            <b>3.</b> Cancel the sorting of the <b>Full Name</b> column (click on its header until it's not sorted anymore) and try sorting the <b>Birthday</b> or <b>Favorite Color</b> columns instead. A user-defined function sets the expected order of the colors, which is the order rainbow colors: <code>Red</code>, <code>Orange</code>, <code>Yellow</code>, <code>Green</code>, <code>Cyan</code>, <code>Blue</code>, <code>Violet</code>.<br>
        {:else if $page.routeIdMatches[1] === '10'}
            This table utilizes user-defined functions to alter the search/filter process.<br>
            ℹ️ Search and filtering process can be first delegated to user-defined functions. These functions must return the processed data along with a flag specifying whether the process is finalized. If not finalized, the default search/filter will be performed on the returned data.<br>
            ℹ️ If filtering is finalized by a user-defined function, a distinctive styling (e.g. different text color) will be applied to the filter phrase.<br>
            The customizations of this table are as follows:<br>
            <b>1.</b> <b>Search</b> can only be done on rows that have an <b>even score number</b>. That is because a user-defined function removes all rows that have odd scores (e.g. <code>1</code>,<code>3</code>,<code>5</code>,<code>7</code>) and then returns the remaining data along with a flag that allows the default search function to perform the actual search.<br>
            <b>2.</b> The <b>Score</b> column can be filtered by a <b>number range</b> (two integers separated by a hyphen). When the user-defined function detects a valid range, it filters out all non-matching rows and then returns the filtered data along with a flag that marks the filtering as finalized. If the process is not finalized, the default filter function will look for score numbers that have the exact characters as our range (including the hyphen) and will always fail.<br>
            <b>3.</b> The <b>Birthday</b> column can be filtered by a <b>date range</b>. The methodology is similar to that used for the <b>Score</b> column.<br>
        {/if}
    </p>

    <slot></slot>

    <p class="ref">
        See the source code 
        <a href="https://github.com/muonw/powertable/blob/main/src/routes/examples/example{$page.routeIdMatches[1]}/+page.svelte">
            here
        </a>
    </p>
{/if}

<style>
nav {
    margin-top: 10px;
    margin-bottom: 10px;
}
nav a {
    display: inline-block;
    background-color: #f2f2f2;
    padding: 5px 8px;
    border-radius: 5px;
    text-decoration: none;
    margin-right: 5px;
    margin-bottom: 10px;
}
nav a:hover {
    background-color: #dfdfdf;
}
a.selected {
    box-shadow: 0 0 0px 1px #acaaaa, 0 0 3px 0 #747474;
}
.setup-details {
    background-color: #d9ebff;
    padding: 10px;
    border-radius: 5px;
    line-height: 1.2rem;
}
code {
    background-color: #fffddb;
    padding: 1px 2px;
    border-radius: 3px;
}
</style>