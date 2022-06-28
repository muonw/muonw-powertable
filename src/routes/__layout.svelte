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