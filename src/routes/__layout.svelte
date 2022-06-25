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
</style>