<template>
    <div class="playlist-container">
        <div class="top-wrap">
            <div class="img-wrap">
                <img :src="playlist.coverImgUrl" alt="" />
            </div>
            <div class="info-wrap">
                <p class="title">{{ playlist.name }}</p>
                <div class="author-wrap">
                    <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
                    <span class="name">{{ playlist.creator.nickname }}</span>
                    <span class="time">{{ playlist.createTime | formatDate }} 创建</span>
                </div>
                <div class="play-wrap">
                    <span class="iconfont icon-circle-play"></span>
                    <span class="text">播放全部</span>
                </div>
                <div class="tag-wrap">
                    <span class="title">标签:</span>
                    <ul>
                        <li v-for="(item,index) in playlist.tags" :key="index">{{ item }}</li>
                    </ul>
                </div>
                <div class="desc-wrap">
                    <span class="title">简介:</span>
                    <span class="desc">{{ playlist.description }}</span>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeIndex">
            <el-tab-pane label="歌曲列表" name="1">
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
                    <tr class="el-table__row" v-for="(item,index) in playlistTracks" :key="index">
                        <td>{{ index+1 }}</td>
                        <td>
                            <div class="img-wrap">
                                <img :src="item.al.picUrl" alt="" />
                                <span class="iconfont icon-play"></span>
                            </div>
                        </td>
                        <td>
                            <div class="song-wrap">
                                <div class="name-wrap">
                                    <span>{{ item.name }}</span>
                                    <span class="iconfont icon-mv"></span>
                                </div>
                                <span v-if="item.ar[0].alias.length!=0">{{ item.ar[0].alias[0] }}</span>
                            </div>
                        </td>
                        <td>{{ item.ar[0].name }}</td>
                        <td>{{ item.al.name }}</td>
                        <td>{{ item.dt | formatTime }}</td>
                    </tr>
                    </tbody>
                </table>
            </el-tab-pane>
            <el-tab-pane label="评论(66)" name="2">
                <!-- 精彩评论 -->
                <div class="comment-wrap">
                    <p class="title">精彩评论<span class="number">({{ hotCount }})</span></p>
                    <div class="comments-wrap">
                        <div
                            class="item"
                            v-for="(item,index) in hotComments"
                            :key="index"
                        >
                            <div class="icon-wrap">
                                <img :src="item.user.avatarUrl" alt="" />
                            </div>
                            <div class="content-wrap">
                                <div class="content">
                                    <span class="name">{{ item.user.nickname }}：</span>
                                    <span class="comment">{{ item.content }}</span>
                                </div>
                                <div class="re-content" v-if="item.beReplied.length!=0">
                                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                                    <span class="comment">{{ item.beReplied[0].content }}</span>
                                </div>
                                <div class="date">{{ item.time | formatDate }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 最新评论 -->
                <div class="comment-wrap">
                    <p class="title">最新评论<span class="number">({{ total }})</span></p>
                    <div class="comments-wrap">
                        <div
                            class="item"
                            v-for="(item,index) in newComments"
                            :key="index"
                        >
                            <div class="icon-wrap">
                                <img :src="item.user.avatarUrl" alt="" />
                            </div>
                            <div class="content-wrap">
                                <div class="content">
                                    <span class="name">{{ item.user.nickname }}：</span>
                                    <span class="comment">{{ item.content }}</span>
                                </div>
                                <div class="re-content" v-if="item.beReplied.length!=0">
                                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                                    <span class="comment">{{ item.beReplied[0].content }}</span>
                                </div>
                                <div class="date">{{ item.time | formatDate }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分页器 -->
                <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next"
                        :total="total"
                        :current-page="page"
                        :page-size="5"
                >
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'playlist',
        data() {
            return {
                activeIndex: '1',
                // 总条数
                total: 0,
                // 页码
                page: 1,
                playlist: {},
                // 歌曲列表
                playlistTracks: [],
                // 热门评论
                hotComments: [],
                hotCount: 0,
                // 最新评论
                newComments: []
            };
        },
        created() {
            // 详情页
            axios({
                url: 'https://autumnfish.cn/playlist/detail',
                methods: 'get',
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                this.playlist = res.data.playlist
                this.playlistTracks = res.data.playlist.tracks
            })
            // 热门评论
            axios({
                url: 'https://autumnfish.cn/comment/hot',
                methods: 'get',
                params: {
                    id: this.$route.query.id,
                    type: 2,
                    limit: 5
                }
            }).then(res => {
                this.hotComments = res.data.hotComments
                this.hotCount = res.data.total
            })
            // 最新评论
            this.getNewComments()
        },
        filters: {
            // 处理时间 毫秒->分秒
            formatTime: function(time) {
                let min = parseInt(time / 1000 / 60)
                min = min < 10 ? '0' + min : min
                let sec = parseInt(time / 1000 % 60)
                sec = sec < 10 ? '0' + sec : sec
                return min + ':' + sec
            },
            // YYYY-MM-DD hh:mm:ss
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            }
        },
        methods: {
            // 最新评论
            getNewComments() {
                axios({
                    url: 'https://autumnfish.cn/comment/playlist',
                    methods: 'get',
                    params: {
                        id: this.$route.query.id,
                        limit: 5,
                        offset: (this.page-1)*5
                    }
                }).then(res => {
                    this.newComments = res.data.comments
                    this.total = res.data.total
                })
            },
            // 分页
            handleCurrentChange(val) {
                this.page = val
                this.getNewComments()
            }
        }
    };
</script>

<style >

</style>
