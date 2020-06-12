<template>
    <div class="result-container">
        <div class="title-wrap">
            <h2 class="title">{{ $route.query.kw }}</h2>
            <span class="sub-title">找到{{ songCount }}个结果</span>
        </div>
        <el-tabs v-model="activeIndex">
            <el-tab-pane label="歌曲" name="songs">
                <table class="el-table">
                    <thead>
                    <th></th>
                    <th>音乐标题</th>
                    <th>歌手</th>
                    <th>专辑</th>
                    <th>时长</th>
                    </thead>
                    <tbody>
                        <tr
                            class="el-table__row"
                            v-for="(item,index) in songsLists"
                            :key="index"
                            @dblclick="playMusic(item.id)"
                        >
                            <td>{{ index+1 }}</td>
                            <td>
                                <div class="song-wrap">
                                    <div class="name-wrap">
                                        <span>{{ item.name }}</span>
                                        <span v-if="item.mvid!=0" class="iconfont icon-mv"></span>
                                    </div>
                                    <span v-if="item.alias.length!=0">{{ item.alias[0] }}</span>
                                </div>
                            </td>
                            <td>{{ item.artists[0].name }}</td>
                            <td>{{ item.album.name }}</td>
                            <td>{{ item.duration | formatTime }}</td>
                        </tr>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane label="歌单" name="lists">
                <div class="items">
                    <div
                        class="item"
                        v-for="(item,index) in playlists"
                        :key="index"
                        @click="toDetail(item.id)"
                    >
                        <div class="img-wrap">
                            <div class="num-wrap">
                                播放量:
                                <span class="num">{{ item.playCount | formatCount }}</span>
                            </div>
                            <img :src="item.coverImgUrl" alt="" />
                            <span class="iconfont icon-play"></span>
                        </div>
                        <p class="name">{{ item.name }}</p>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="MV" name="mv">
                <div class="items mv">
                    <div
                        class="item"
                        v-for="(item,index) in mvlists"
                        :key="index"
                        @click="toMV(item.id)"
                    >
                        <div class="img-wrap">
                            <img :src="item.cover" alt="" />
                            <span class="iconfont icon-play"></span>
                            <div class="num-wrap">
                                <div class="iconfont icon-play"></div>
                                <div class="num">{{ item.playCount | formatCount }}</div>
                            </div>
                            <span class="time">{{ item.duration | formatTime }}</span>
                        </div>
                        <div class="info-wrap">
                            <div class="name">{{ item.name }}</div>
                            <div class="singer">{{ item.artistName }}</div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'result',
        data() {
            return {
                activeIndex: 'songs',
                // 歌曲
                songsLists: [],
                songCount: 0,
                // 歌单
                playlists: [],
                playlistCount: 0,
                // MV
                mvlists: [],
                mvCount: 0
            }
        },
        created() {
            this.searchList(1,10)
        },
        watch:{
            activeIndex(){
                let type = 1
                let limit = 10
                switch (this.activeIndex) {
                    case 'songs':
                        type = 1
                        break;
                    case 'lists':
                        type = 1000
                        break;
                    case 'mv':
                        type = 1004
                        limit = 8
                        break;
                    default:
                        break;
                }
                this.searchList(type,limit)
            }
        },
        filters: {
            // 处理时间 毫秒->分秒
            formatTime: function (time) {
                let min = parseInt(time / 1000 / 60)
                min = min < 10 ? '0' + min : min
                let sec = parseInt(time / 1000 % 60)
                sec = sec < 10 ? '0' + sec : sec
                return min + ':' + sec
            },
            // 处理次数：超过10万，显示xx万
            formatCount: function (count) {
                if(count > 100000){
                    let playCount = parseInt(count/10000)+'万'
                    return playCount
                }
            }
        },
        methods: {
            // 获取数据
            searchList(type,limit) {
                axios({
                    url: 'https://autumnfish.cn/search',
                    methods: 'get',
                    params: {
                        keywords: this.$route.query.kw,
                        type,
                        limit
                    }
                }).then(res => {
                    if(type == 1){
                        this.songsLists = res.data.result.songs
                        this.songCount = res.data.result.songCount
                    }else if (type == 1000) {
                        this.playlists = res.data.result.playlists
                        this.playlistCount = res.data.result.playlistCount
                    }else if (type == 1004) {
                        this.mvlists = res.data.result.mvs
                        this.mvCount = res.data.result.mvCount
                    }
                })
            },
            // 播放音乐
            playMusic(id){
                axios({
                    url: 'https://autumnfish.cn/song/url',
                    methods: 'get',
                    params: {
                        id
                    }
                }).then(res => {
                    let songUrl = res.data.data[0].url
                    this.$parent.musicUrl = songUrl
                })
            },
            // 歌单详情页
            toDetail(id) {
                this.$router.push(`/playlist?id=${id}`)
            },
            // MV详情页
            toMV(id) {
                this.$router.push(`/mv?id=${id}`)
            }
        }
    }
</script>

<style >

</style>
