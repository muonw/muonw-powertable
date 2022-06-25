<script>
let subDir = process.env.NODE_ENV === 'development' ? '' : '/powertable'
</script>

<nav>
    <a href="{subDir}/examples/example1">#1 Basic</a>
    <a href="{subDir}/examples/example2">#2 Instructs</a>
</nav>

<slot></slot>

<style>
nav a {
    display: block;
}
</style>