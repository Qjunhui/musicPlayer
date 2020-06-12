<template>
    <!-- 主体区域 -->
    <section id="player">
        <header class="header">
            <h1>
                简易播放器
            </h1>
            <!-- 输入框 -->
            <input placeholder="请输入歌名" class="new-todo" v-model="inputValue" @keyup.enter="search"/>
        </header>
        <!-- 列表区域 -->
        <section class="main">
            <ul class="music-list">
                <li v-for="(item,index) in results" :key="index" class="music">
                    <div class="view">
                        <span class="index">{{ index+1 }}.</span>
                        <label>{{ item.name }}</label>
                        <button @click="play(item.id)" class="play"></button>
                    </div>
                </li>
            </ul>
        </section>
        <!-- 音频标签 -->
        <footer class="footer">
            <audio :src="url" autoplay controls></audio>
        </footer>
    </section>
</template>

<script>
    import '../assets/css/player.css'
    import axios from 'axios'

    export default {
        el : '#player',
        data() {
            return {
                // 双向数据绑定
                inputValue : '',
                // 搜索结果
                results : [],
                // 歌曲播放地址
                url : ''
            }
        },
        methods : {
            // 回车搜歌
            search() {
                axios({
                    url:'https://autumnfish.cn/search',
                    method:'get',
                    params:{
                        keywords : this.inputValue
                    }
                }).then(res => {
                    this.results = res.data.result.songs
                })
            },
            // 点击播放
            play(id) {
                axios({
                    url:'https://autumnfish.cn/song/url',
                    method:'get',
                    params:{
                        id
                    }
                }).then(res => {
                    this.url = res.data.data[0].url
                })
            }
        }
    }
</script>

<style scoped>

</style>