<template>
    <div class="discovery-container">
        <!-- 轮播图 -->
        <el-carousel class="" :interval="4000" type="card">
            <el-carousel-item v-for="(item,index) in banners" :key="index">
                <img :src="item.imageUrl" alt="" @click="playMusic(item.targetId)"/>
            </el-carousel-item>
        </el-carousel>
        <!-- 推荐歌单 -->
        <div class="recommend">
            <h3 class="title">
                推荐歌单
            </h3>
            <div class="items">
                <div
                    class="item"
                    v-for="(item,index) in personalized"
                    :key="index"
                    @click="toPlayList(item.id)"
                >
                    <div class="img-wrap">
                        <div class="desc-wrap">
                            <span class="desc">{{ item.copywriter }}</span>
                        </div>
                        <img :src="item.picUrl" alt="" />
                        <span class="iconfont icon-play"></span>
                    </div>
                    <p class="name">{{ item.name }}</p>
                </div>
            </div>
        </div>
        <!-- 最新音乐 -->
        <div class="news">
            <h3 class="title">
                最新音乐
            </h3>
            <div class="items">
                <div class="item" v-for="(item,index) in newsongs" :key="index">
                    <div class="img-wrap">
                        <img :src="item.picUrl" alt="" />
                        <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
                    </div>
                    <div class="song-wrap">
                        <div class="song-name">{{ item.name }}</div>
                        <div class="singer">{{ item.song.artists[0].name }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐MV -->
        <div class="mvs">
            <h3 class="title">推荐MV</h3>
            <div class="items">
                <div class="item" v-for="(item,index) in mvs" :key="index">
                    <div class="img-wrap">
                        <img :src="item.picUrl" alt="" />
                        <span class="iconfont icon-play" @click="toMV(item.id)"></span>
                        <div class="num-wrap">
                            <div class="iconfont icon-play"></div>
                            <div class="num">{{ item.playCount }}</div>
                        </div>
                    </div>
                    <div class="info-wrap">
                        <div class="name">{{ item.name }}</div>
                        <div class="singer">{{ item.artistName }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'discovery',
        data(){
            return {
                banners: [],
                personalized: [],
                newsongs: [],
                mvs: []
            }
        },
        created() {
            //  轮播图
            axios({
                url: 'https://autumnfish.cn/banner',
                methods: 'get'
            }).then(res => {
                this.banners = res.data.banners
            })
            // 推荐歌单
            axios({
                url: 'https://autumnfish.cn/personalized',
                methods: 'get',
                params: {
                    limit: 10
                }
            }).then(res => {
                this.personalized = res.data.result
            })
            // 最新音乐
            axios({
                url: 'https://autumnfish.cn/personalized/newsong',
                methods: 'get'
            }).then(res => {
                this.newsongs = res.data.result
            })
            // 推荐MV
            axios({
                url: 'https://autumnfish.cn/personalized/mv',
                methods: 'get'
            }).then(res => {
                this.mvs = res.data.result
            })
        },
        methods:{
            // 播放音乐
            playMusic(id) {
                axios({
                    url: 'https://autumnfish.cn/song/url',
                    methods: 'get',
                    params: {
                        id
                    }
                }).then(res => {
                    let songUrl = res.data.data[0].url
                    // console.log(this.$parent.musicUrl)
                    this.$parent.musicUrl = songUrl
                })
            },
            // MV
            toMV(id) {
                this.$router.push(`/mv?id=${id}`);
            },
            // 歌单详情
            toPlayList(id) {
                this.$router.push(`/playlist?id=${id}`);
            }
        }
    };
</script>

<style >

</style>
