<nav>
    <a href="/powertable/">Home</a> | 
    <a href="https://github.com/muonw/powertable">
        <svg height="14" width="14" aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true" class="octicon octicon-mark-github">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        Repository
    </a>
</nav>

<slot></slot>

<style lang="scss" global>
@import '../../node_modules/@muonw/mascara/package/styles/index.scss';
@import '../lib/styles/power-table.scss';

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

nav {
    margin-bottom: 20px;
}
.ref {
    background-color: rgb(255, 247, 232);
    border: 1px solid rgb(255, 183, 115);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 3px 0px rgb(255, 192, 120);
    box-sizing: border-box;
    font-size: medium;
}
</style>