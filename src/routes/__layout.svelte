<script>
let subDir = process.env.NODE_ENV === 'development' ? '' : '/powertable'
</script>

<nav>
    <a href="{subDir}/">Home</a>
</nav>

<slot></slot>

<style lang="scss" global>
@import '../../node_modules/@muonw/mascara/src/lib/styles/main.scss';
@import '../lib/styles/power-table.scss';

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