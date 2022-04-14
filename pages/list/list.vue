<template>
	<view class="list" v-if="!loading">
		<view class="fixbg" :style="{backgroundImage: `url(${listDetail.coverImgUrl})`}"></view>
		<MusicHeader title="歌单" :flag="true" textColor="#fff"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="list-header">
					<view class="list-header-img">
						<image :src="listDetail.coverImgUrl" mode=""></image>
						<view class="list-header-text">
							<text class="iconfont icon-xiangyousanjiaoxing"></text>
							{{listDetail.playCount | formatCount}}
						</view>
					</view>
					<view class="list-header-info">
						<view>{{listDetail.name}}</view>
						<view>
							<image :src="listDetail.creator.avatarUrl" mode=""></image>
							{{listDetail.creator.nickname}}
						</view>
						<view>{{listDetail.description}}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-share"></text>
					分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-header">
						<text class="iconfont icon-play"></text>
						<text>播放全部</text>
						<text>(共{{listDetail.trackCount}}首)</text>
					</view>
					<view class="list-music-wrap">
						<view class="list-music-item" v-for="(item, index) in listDetail.tracks" :key="item.id" @tap="toSongDetail(item.id)">
							<view class="list-item-index">{{index + 1}}</view>
							<view class="list-item-info">
								<view class="item-name ellipsis-1 ">{{item.name}}</view>
								<view class="item-singer ellipsis-1 ">
									<view v-for="(a, i) in item.ar" :key="i">
										{{a.name}}
									</view> - {{item.al.name}}
								</view>
							</view>
							<text class="iconfont icon-play"></text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>	
	</view>
</template>

<script>
	import MusicHeader from "@/components/MusicHeader/MusicHeader.vue";
	import { getPlayList } from "@/common/apis.js";
	export default {
		data() {
			return {
				listDetail: "",
				loading: false,
			}
		},
		comments:{
			MusicHeader,
		},
		onLoad(options) {
			this.getPlayListDetail(options.id);
		},
		methods: {
			getPlayListDetail(id) {
				uni.showLoading({
					title: "加载中...",
					mask: true
				});
				this.loading = true;
				getPlayList(id).then(res => {
					if(res.code === 200) {
						this.listDetail = res.playlist;
						this.$store.commit("setListIds", res.playlist.trackIds)
						this.loading = false;
						uni.hideLoading();
					}
				})
			},
			toSongDetail(id) {
				uni.navigateTo({
					url: "/pages/SongDetail/SongDetail?id=" + id
				})
			}
		}
	}
</script>

<style scoped>
.list-header {
	display: flex;
	margin: 30rpx;
}
.list-header-img {
	width: 264rpx;
	height: 264rpx;
	position: relative;
	margin-right: 42rpx;
	border-radius: 30rpx;
	overflow: hidden;
}
.list-header-img image {
	width: 100%;
	height: 100%;
}
.list-header-img .list-header-text {
	position: absolute;
	right: 8rpx;
	top: 8rpx;
	color: #fff;
	font-size: 26rpx;
}
.list-header-info {
	color: #f0f2f7;
	flex: 1;
}
.list-header-info view:nth-child(1) {
	color: #fff;
	font-size: 34rpx;
}
.list-header-info view:nth-child(2) {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	margin: 20rpx 0;
}
.list-header-info view:nth-child(2) image {
	width: 54rpx;
	height: 54rpx;
	border-radius: 50%;
	margin-right: 14rpx;
}
.list-header-info view:nth-child(3) {
	font-size: 22rpx;
	line-height: 34rpx;
}
.list-share {
	width: 330rpx;
	height: 74rpx;
	margin: 0 auto;
	background: rgba(0, 0, 0, .4);
	border-radius: 37rpx;
	color: #fff;
	text-align: center;
	font-size: 28rpx;
	line-height: 74rpx;
}
.list-share text {
	margin-right: 16rpx;
}
.list-music {
	width: 100%;
	border-radius: 50rpx 50rpx 0 0;
	background-color: #fff;
	margin-top: 40rpx;
	overflow: hidden;
}
.list-music-header {
	display: flex;
	height: 50rpx;
	margin: 30rpx 0 70rpx 22rpx;
	align-items: center;
}
.list-music-header text:nth-child(1) {
	font-size: 50rpx;
	height: 50rpx;
}
.list-music-header text:nth-child(2) {
	margin: 0 10rpx 0 25rpx;
	font-size: 30rpx;
}
.list-music-header text:nth-child(3) {
	font-size: 26rpx;
	color: #b2b2b2;
}
.list-music-item {
	margin: 0 30rpx 66rpx 6rpx;
	display: flex;
	align-items: center;
	color: #959595;
}
.list-item-index {
	width: 80rpx;
	font-size: 30rpx;
	line-height: 50rpx;
	text-align: center;
}
.list-item-info {
	flex: 1;
}
.item-name {
	font-size: 28rpx;
	max-width: 520rpx;
	color: #000;
}
.ellipsis-1 {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.item-singer {
	display: flex;
	align-items: center;
	font-size: 20rpx;
	max-width: 520rpx;
}
.item-singer image {
	width: 32rpx;
	height: 20rpx;
	margin-right: 10rpx;
}
.list-music-item text {
	font-size: 50rpx;
	color: #c7c7c7;
}
</style>
