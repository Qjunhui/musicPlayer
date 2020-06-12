<template>
    <div id="app">
        <h2 @click="handleClick">Vue</h2>
        <h2>{{ name }}</h2>
    </div>
</template>

<script>
    // 启动单文件：vue serve 1.vue

    /*
        1.template只能有一个根结点
        2。script中的data写成函数，内部返回一个对象
        3.可以import引入写好的样式
     */

    import './css/base.css'

    export default {
        data() {
            return {
                name : 'qjh'
            }
        },
        methods:{
            handleClick() {
                alert('click.....')
            }
        }
    }
</script>

<style scoped>
    #app {
        background-color: aquamarine;
    }
</style>