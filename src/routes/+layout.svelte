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

import '../lib_local/styles/main.scss';
import '$lib/styles/power-table.scss';
import '$lib/styles/power-table-mascara.scss';
</script>

<nav>
    <a href="/powertable/">Home</a> | 
    <a href="https://github.com/muonw/powertable">GitHub</a> | 
    <span id='switch-to-light-mode' title="Light Mode" on:click={()=>switchColorScheme('light')} on:keypress={()=>switchColorScheme('light')}>☀️</span>
    <span id='switch-to-dark-mode' title="Dark Mode" on:click={()=>switchColorScheme('dark')} on:keypress={()=>switchColorScheme('dark')}>🌙</span>
</nav>

<hr>

<slot></slot>
