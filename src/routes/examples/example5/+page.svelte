<script lang="ts">
import data from '../../../data/jobs.json';
import PowerTable from '$lib/components/PowerTable.svelte';
import type {Options} from '$lib/components/PowerTable.svelte';

let ptOptions: Options = {
    rowsPerPage: 20,
}
</script>


<div class="ex5_style1">
    <PowerTable
        ptData={data}
        ptOptions={ptOptions}
    />
</div>


<style lang="scss">
$light_root: (
    --colors-custom-style1-background: #fcf3ff,
);

$dark_root: (
    --colors-custom-style1-background: #3f2e44,
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

:global(.ex5_style1 div[data-name=table-container]) {
    max-height: 340px;
}
:global(.ex5_style1 div[data-name=table-container] table tbody td) {
    padding: 0.9rem 0.4rem;
}
:global(.ex5_style1 div[data-name=table-container] table tbody td[data-key=id]) {
    transform: rotate(-90deg);
    text-align: center;
}
:global(.ex5_style1 div[data-name=table-container] table tbody tr:nth-child(2n)) {
    background-color: var(--colors-custom-style1-background) !important;
}
</style>