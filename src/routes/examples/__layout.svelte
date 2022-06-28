<script>
import { page } from '$app/stores';

let subDir = process.env.NODE_ENV === 'development' ? '' : '/powertable';

let pages = {
    1: 'Basic',
    2: 'Custom Instructs',
    3: 'Custom Options',
    4: 'Custom Slots',
    5: 'Styling',
};
</script>

<nav>
    {#each Object.entries(pages) as [key, name]}
        <a
            href="{subDir}/examples/example{key}"
            class:selected={$page.routeId === `examples/example${key}`}
        >
            {key}. {name}
        </a>
    {/each}
</nav>

{#if $page.routeIdMatches = new RegExp("^examples\/example([0-9])+$", "g").exec($page.routeId)}
    <p class="setup-details">
        {#if $page.routeIdMatches[1] === '1'}
            This is a basic setup with no customizations.
        {:else if $page.routeIdMatches[1] === '2'}
            Customizations of ptInstructs:<br>
            <b>1.</b> <b>Column titles</b> have been customized.<br>
            <b>2.</b> First name is <b>not sortable</b>.<br>
            <b>3.</b> Company has a <b>default filter phrase</b>.<br>
            <b>4.</b> Department is <b>not filterable</b>.<br>
            <b>5.</b> A custom function has adds <b>emojis and HTML tags</b> to some job titles.<br>
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
            Following customizations with named slots:<br>
            <b>1.</b> A custom text is used for <b>noResults</b> slot.<br>
        {:else if $page.routeIdMatches[1] === '5'}
            Following customizations of styles:<br>
            <b>1.</b> A <b>maximum height</b> is set for the table, creating a vertical scroll bar.<br>
            <b>2.</b> The height and color of the rows, and the direction of the id values have changed.<br>
        {/if}
    </p>

    <slot></slot>

    <p class="ref">
        See the source code 
        <a href="https://github.com/muonw/powertable/blob/main/src/routes/examples/example{$page.routeIdMatches[1]}.svelte">
            here
        </a>
    </p>
{/if}

<style>
nav {
    margin-top: 10px;
    margin-bottom: 20px;
}
nav a {
    display: inline-block;
    background-color: #f2f2f2;
    padding: 5px 8px;
    border-radius: 5px;
    text-decoration: none;
    margin-right: 5px;
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
}
</style>