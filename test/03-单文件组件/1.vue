<template>
    <div id="app">
        <h2 @click="handleClick">Vue</h2>
    </div>
</template>

<script>
    export default {
        methods:{
            handleClick() {
                alert('click.....')
            }
        }
    }
</script>

<style scoped>
    #app {
        background-color: hotpink;
    }
</style>