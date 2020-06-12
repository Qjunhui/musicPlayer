<template>
    <div>
        <h2>Vue</h2>
        <player></player>
    </div>
</template>

<script>
    // 导入组件
    import player from './components/player'

    export default {
        // 注册
        components:{
            player
        }
    }
</script>

<style scoped>

</style>