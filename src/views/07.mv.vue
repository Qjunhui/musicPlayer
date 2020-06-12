<template>
    <div class="mv-container">
        <div class="mv-wrap">
            <h3 class="title">mv详情</h3>
            <!-- mv -->
            <div class="video-wrap">
                <video
                        controls
                        :src="mvUrl"
                ></video>
            </div>
            <!-- mv信息 -->
            <div class="info-wrap">
                <div class="singer-info">
                    <div class="avatar-wrap">
                        <img :src="singerPic" alt="" />
                    </div>
                    <span class="name">{{ mvDetail.artistName }}</span>
                </div>
                <div class="mv-info">
                    <h2 class="title">{{ mvDetail.name }}</h2>
                    <span class="date">发布：{{ mvDetail.publishTime }}</span>
                    <span class="number">播放：{{ mvDetail.playCount }}次</span>
                    <p class="desc">{{ mvDetail.desc }}</p>
                </div>
            </div>
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
                        v-for="(item,index) in comments"
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
                    :limit="limit"
            >
            </el-pagination>
        </div>
        <!--  相关推荐 -->
        <div class="mv-recommend">
            <h3 class="title">相关推荐</h3>
            <div class="mvs">
                <div class="items">
                    <div
                        class="item"
                        v-for="(item,index) in simiMvs"
                        :key="index"
                    >
                        <div class="img-wrap">
                            <img :src="item.cover" alt="" />
                            <span class="iconfont icon-play" @click="toMV(item.id)"></span>
                            <div class="num-wrap">
                                <div class="iconfont icon-play"></div>
                                <div class="num">{{ item.playCount }}</div>
                            </div>
                            <span class="time">{{ item.duration }}</span>
                        </div>
                        <div class="info-wrap">
                            <div class="name">{{ item.name }}</div>
                            <div class="singer">{{ item.artistName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: 'mv',
        data() {
            return {
                // 总条数
                total: 0,
                // 页码
                page: 1,
                // 页容量
                limit: 10,
                mvUrl: '',
                simiMvs: [],
                mvDetail: {},
                singerPic: '',
                // MV评论
                comments: [],
                hotComments: [],
                hotCount: 0
            };
        },
        watch: {
            '$route' (to, from) {
                if (to.query.id != from.query.id) {
                    this.$router.go(0)
                }
            }
        },
        created() {
            // MV详情页
            axios({
                url: 'https://autumnfish.cn/mv/url',
                methods: 'get',
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                this.mvUrl = res.data.data.url
            })
            // 相关MV
            axios({
                url: 'https://autumnfish.cn/simi/mv',
                methods: 'get',
                params: {
                    mvid: this.$route.query.id
                }
            }).then(res => {
                this.simiMvs = res.data.mvs
            })
            // MV信息
            axios({
                url: 'https://autumnfish.cn/mv/detail',
                methods: 'get',
                params: {
                    mvid: this.$route.query.id
                }
            }).then(res => {
                this.mvDetail = res.data.data
                // 歌手信息
                axios({
                    url: 'https://autumnfish.cn/artists',
                    methods: 'get',
                    params: {
                        id: res.data.data.artistId
                    }
                }).then(res => {
                    this.singerPic = res.data.artist.picUrl
                })
            })
            // MV评论
            axios({
                url: 'https://autumnfish.cn/comment/mv',
                methods: 'get',
                params: {
                    id: this.$route.query.id,
                    limit: 5,
                    offset: 0
                }
            }).then(res => {
                this.hotComments = res.data.hotComments
                this.hotCount = res.data.hotComments.length
                this.comments = res.data.comments
                this.total = res.data.total
            })
        },
        filters: {
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
            handleCurrentChange(val) {
                this.page = val
                axios({
                    url: 'https://autumnfish.cn/comment/mv',
                    methods: 'get',
                    params: {
                        id: this.$route.query.id,
                        limit: 5,
                        offset: (this.page-1)*5
                    }
                }).then(res => {
                    this.comments = res.data.comments
                    this.total = res.data.total
                })
            },
            // 相关推荐跳转MV
            toMV(id) {
                this.$router.push(`/mv?id=${id}`)
            }
        }
    };
</script>

<style></style>
