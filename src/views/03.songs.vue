<template>
    <div class="songs-container">
        <div class="tab-bar">
            <span class="item" :class="{active:tag==0}" @click="tag=0">全部</span>
            <span class="item" :class="{active:tag==7}" @click="tag=7">华语</span>
            <span class="item" :class="{active:tag==96}" @click="tag=96">欧美</span>
            <span class="item" :class="{active:tag==8}" @click="tag=8">日本</span>
            <span class="item" :class="{active:tag==16}" @click="tag=16">韩国</span>
        </div>
        <!-- 底部的table -->
        <table class="el-table playlit-table">
            <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
            </thead>
            <tbody>
            <tr class="el-table__row" v-for="(item,index) in songs" :key="index">
                <td>{{ index+1 }}</td>
                <td>
                    <div class="img-wrap">
                        <img :src="item.album.picUrl" alt="" />
                        <span class="iconfont icon-play" @click="playMusic(item.id)"></span>
                    </div>
                </td>
                <td>
                    <div class="song-wrap">
                        <div class="name-wrap">
                            <span>{{ item.name }}</span>
                            <span class="iconfont icon-mv"></span>
                        </div>
                        <span>{{ }}</span>
                    </div>
                </td>
                <td>{{ item.artists[0].name }}</td>
                <td>{{ item.album.name }}</td>
                <td>{{ item.duration | formatTime }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'songs',
        data() {
            return {
                songs: [],
                tag: 0 // 分类
            };
        },
        watch: {
            tag() {
                this.getSongs()
            }
        },
        created(){
            this.getSongs()
        },
        filters: {
            // 处理时间 毫秒->分秒
            formatTime: function (time) {
                let min = parseInt(time / 1000 / 60)
                min = min < 10 ? '0' + min : min
                let sec = parseInt(time / 1000 % 60)
                sec = sec < 10 ? '0' + sec : sec
                return min + ':' + sec
            }
        },
        methods: {
            // 获取歌曲列表
            getSongs() {
                axios({
                    url: 'https://autumnfish.cn/top/song/',
                    methods: 'get',
                    params: {
                        type: this.tag
                    }
                }).then(res => {
                    this.songs = res.data.data
                })
            },
            // 播放歌曲
            playMusic(id) {
                axios({
                    url: 'https://autumnfish.cn/song/url',
                    methods: 'get',
                    params: {
                        id: id
                    }
                }).then(res => {
                    let url = res.data.data[0].url
                    this.$parent.musicUrl = url
                })
            }
        }
    };
</script>

<style >

</style>
