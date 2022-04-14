<template>
	<view class="song-detail" v-if="!loading">
		<view class="fixbg" :style="{backgroundImage: `url(${songDetail.al.picUrl})`}"></view>
		<MusicHeader :title="songDetail.name" :flag="true" textColor="#fff"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="song-detail-img">
					<image :src="songDetail.al.picUrl" :class="{'img-rotate': isPlayRotate}" mode=""></image>
					<text class="iconfont" :class="playIcon" @tap="play"></text>
				</view>
				<view class="song-detail-lyric">
					<view class="lyric-wrap" :style="{transform: `translateY(${(lyricIndex - 1) * -82}rpx)`}">
						<view class="lyric-item" :class="{active: lyricIndex === i}" v-for="(l, i) in lyric" :key="i">{{l.lyric}}</view>
					</view>
				</view>
				<view class="song-detail-like">
					<view class="like-header">喜欢这首歌的人也听</view>
					<view class="like-item" v-for="song in songs" :key="song.id" @tap="playSimiSong(song.id)">
						<view class="like-item-img">
							<image :src="song.album.picUrl" mode=""></image>
						</view>
						<view class="like-item-info">
							<view class="like-item-song">{{song.name}}</view>
							<view class="like-item-art">{{song.artists[0].name}} - {{song.name}}</view>
						</view>
						<text class="iconfont icon-play"></text>
					</view>
				</view>
				<view class="song-detail-comment">
					<view class="comment-header">精彩评论</view>
					<view class="comment-item" v-for="comment in hotComments" :key="comment.commentId">
						<view class="comment-item-img">
							<image :src="comment.user.avatarUrl" mode=""></image>
						</view>
						<view class="commemt-item-content">
							<view class="comment-item-top">
								<view class="comment-item-name">
									<view>{{comment.user.nickname}}</view>
									<view class="comment-time">{{comment.timeStr}}</view>
								</view>
								<view class="comment-item-like">
									{{comment.likedCount}} <text class="iconfont icon-good"></text>
								</view>
							</view>
							<view class="comment-item-desc">
								{{comment.content}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from "@/components/MusicHeader/MusicHeader.vue";
	import { songDetail, lyric, simiSongs, musicComment, songUrl } from "@/common/apis.js";
	import { audio } from "@/common/config.js";
	export default {
		data() {
			return {
				songDetail: {
					al: { picUrl: ""},
					name: ""
				},
				songs: [],
				hotComments: [],
				lyric: [],
				lyricIndex: 0,
				loading: false,
				isPlayRotate: true,
				playIcon: "icon-suspended"
			}
		},
		components: {
			MusicHeader
		},
		onLoad(options) {
			const id = options.id;
			this.initMusicInfo(id);
		},
		onUnload() {
			this.cancelListenTimer();
		},
		onHide() {
			this.cancelListenTimer();
		},
		methods: {
			initMusicInfo(id) {
				this.$store.commit("setNextId", id);
				this.loading = true;
				uni.showLoading({
					title: "加载中...",
					mask: true
				});
				Promise.all([
					this.getSongInfo(id), 
					this.getSongLyric(id), 
					this.getSimiSongs(id), 
					this.getMusicComment(id),
					this.getSongUrl(id)
				]).then(res => {
					if(res.length === 5) {
						this.loading = false;
						uni.hideLoading();
					}
				});
			},
			getSongInfo(id) {
				songDetail(id).then(res => {
					if(res.code === 200) {
						this.songDetail = res.songs[0];
					}
				})
			},
			getSongLyric(id) {
				lyric(id).then(res => {
					if(res.code === 200) {
						let lyric = res.lrc.lyric;
						let reg = /\[([^\]]+)\]([^\[]+)/g;
						let result = [];
						lyric.replace(reg, ($0, $1, $2) => {
							result.push({
								time: this.formatTime($1),
								lyric: $2
							})
						});
						this.lyric = result;
					}
				})
			},
			getSimiSongs(id) {
				simiSongs(id).then(res => {
					if(res.code == 200) {
						this.songs = res.songs;
					}
				})
			},
			getMusicComment(id) {
				musicComment(id).then(res => {
					if(res.code === 200) {
						this.hotComments = res.hotComments;
					}
				})
			},
			formatTime(time) {
				let arr = time.split(":");
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1);
			},
			getSongUrl(id) {
				let url = songUrl(id);
				audio.autoplay = true;
				audio.src = url;
				this.listenLyricIndex();
				audio.onPlay(() => {
					this.isPlayRotate = true;
					this.playIcon = "icon-suspended";
					this.listenLyricIndex();
				});
				audio.onPause(() => {
					this.isPlayRotate = false;
					this.playIcon = "icon-play";
					this.cancelListenTimer();
				});
				audio.onEnded(() => {
					this.initMusicInfo(this.$store.state.nextId);
				})
			},
			play() {
				if(audio.paused) {
					audio.play();
				} else {
					audio.pause();
				}
			},
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					for (let i = 0; i < this.lyric.length; i++) {
						let currentTime = audio.currentTime;
						if(currentTime > this.lyric[this.lyric.length - 1].time) {
							this.lyricIndex = this.lyric.length - 1;
							break;
						}
						if(currentTime > this.lyric[i].time && currentTime < this.lyric[i+1].time) {
							this.lyricIndex = i;
						}
					}
				}, 500)
			},
			cancelListenTimer() {
				clearInterval(this.timer)
			},
			playSimiSong(id) {
				this.initMusicInfo(id);
			}
		}
	}
</script>

<style scoped>
.song-detail-img {
	position: relative;
	width: 580rpx;
	height: 580rpx;
	margin: 214rpx auto 0;
	border: 105rpx solid #000;
	border-radius: 50%;
	box-sizing: border-box;
}
.song-detail-img image {
	width: 372rpx;
	height: 372rpx;
	border-radius: 50%;
	position: absolute;
	animation: 10s linear move infinite;
	animation-play-state: paused;
}
.song-detail-img .img-rotate {
	animation-play-state: running;
}
@keyframes move{
	from{ transform: rotate(0deg);}
	to{ transform: rotate(360deg);}
}
.song-detail-img text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	font-size: 100rpx;
}
.song-detail-lyric {
	font-size: 32rpx;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	color: #6f6e73;
}
.lyric-wrap {
	transition: all .8s;
}
.lyric-item {
	height: 82rpx;
}
.lyric-item.active {
	color: #fff;
}
.song-detail-like {
	margin: 0 30rpx;
}
.like-header,
.comment-header {
	margin: 50rpx 0;
	font-size: 36rpx;
	color: #fff;
}
.like-item {
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
}
.like-item-img {
	width: 82rpx;
	height: 82rpx;
	border-radius: 20rpx;
	margin-right: 20rpx;
	overflow: hidden;
}
.like-item-img image {
	width: 100%;
	height: 100%;
}
.like-item-info {
	flex: 1;
}
.like-item-song {
	font-size: 28rpx;
	margin-bottom: 12rpx;
	color: #fff;
}
.like-item-art {
	font-size: 22rpx;
	color: #c6c2bf;
}
.like-item text {
	color: #C6C2BF;
	font-size: 80rpx;
}
.song-detail-comment {
	margin: 0 30rpx;
	overflow: hidden;
}
.comment-item {
	display: flex;
	margin-bottom: 28rpx;
}
.comment-item-img {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 18rpx;
}
.comment-item-img image {
	width: 100%;
	height: 100%;
}
.commemt-item-content {
	flex: 1;
	color: #cbcacf;
}
.comment-item-top {
	display: flex;
	justify-content: space-between;
}
.comment-item-name view:nth-child(1) {
	font-size: 26rpx;
}
.comment-item-name view:nth-child(2) {
	font-size: 20rpx;
}
.comment-item-like {
	font-size: 28rpx;
}
.comment-item-desc {
	font-size: 28rpx;
	line-height: 40rpx;
	color: #fff;
	margin-top: 20rpx;
	border-bottom: 1rpx solid #e0e0e0;
	padding-bottom: 38rpx;
	white-space: pre-wrap;
}
</style>
