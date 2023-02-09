<script lang="ts">
import { onMount} from "svelte";

function switchColorScheme(scheme: 'light'|'dark') {
    let html = document.querySelector('html');
    html?.setAttribute('data-color-scheme', scheme);
}

onMount(() => {
    const colorSwitcher = (event: MediaQueryListEvent) => {
        switchColorScheme(event.matches ? 'dark' : 'light');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSwitcher);

    return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSwitcher);
    }
});
</script>

<nav>
    <a href="/powertable/">Home</a> | 
    <a href="https://github.com/muonw/powertable">GitHub</a> | 
    <span id='switch-to-light-mode' title="Light Mode" on:click={()=>switchColorScheme('light')} on:keypress={()=>switchColorScheme('light')}>☀️</span>
    <span id='switch-to-dark-mode' title="Dark Mode" on:click={()=>switchColorScheme('dark')} on:keypress={()=>switchColorScheme('dark')}>🌙</span>
</nav>

<hr>

<slot></slot>

<style lang="scss" global>
@use 'power-table.scss';
@use '@muonw/mascara/styles/index.scss';

$light_root: (
    --colors-ref-background: #fff7e8,
    --colors-ref-border: #ffb773,
    --colors-ref-shadow: #fff7e8,
);

$dark_root: (
    --colors-ref-background: #443c2f,
    --colors-ref-border: #6c5742,
    --colors-ref-shadow: #6a4909,
);

:root, :root[data-color-scheme='light'] {
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

:root[data-color-scheme='dark'] {
    @each $key, $val in $dark_root {
        #{$key}: $val;
    }
}

a {
    color: var(--colors-a);
}

#switch-to-light-mode {
    display: var(--dark-mode-display);
    cursor: pointer;
}
#switch-to-dark-mode {
    display: var(--light-mode-display);
    cursor: pointer;
}

.MuonW.PowerTable {
    table tbody tr[data-name=titles-tr], tr[data-name=filters-tr] {
        th[data-key=id] {
            width: 50px;
        }
    }
    tr[data-name=filters-tr] {
        input{
            @extend .compact;
        }
    }
    div[data-name=search-container], div[data-name=edit-block] {
        label{
            @extend .embedded;
            & > span, &:focus-within > span {
                @extend .label-text;
            }
        }
    }
    div[data-name=edit-block] {
        button[data-name=edit-submit] {
            margin-top: 8px;
        }
    }
}

.ref {
    background-color: var(--colors-ref-background);
    border: 1px solid var(--colors-ref-border);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 3px 0px var(--colors-ref-shadow);
    box-sizing: border-box;
    font-size: medium;
}
</style>