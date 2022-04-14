<template>
	<view class="index" v-if="!loading">
		<MusicHeader title="网易云音乐" :flag="false"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true" v-if="!loading">
				<view class="index-search" @tap="toSearchPage">
					<text class="iconfont icon-search"></text>
					<input class="index-search-inp" type="text" placeholder="搜索歌曲">
				</view>
				<view class="index-list">
					<view class="index-list-item" v-for="item in topList" :key="item.id" @tap="toListPage(item.id)">
						<view class="list-item-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="list-item-info">
							<view v-for="(t, i) in item.tracks" :key="i" >
								{{i+1}}.{{t.first}} - {{t.second}}
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
	import { getTopList } from "@/common/apis.js";
	export default {
		data() {
			return {
				topList: [],
				loading: false,
			}
		},
		components: {
			MusicHeader,
		},
		onLoad() {
			uni.showLoading({
				title: "加载中..."
			});
			getTopList().then(res => {
				if(res.code === 200) {
					this.topList = res.list.splice(0, 4);
					uni.hideLoading();
				}
			});
		},
		methods: {
			toListPage(id) {
				uni.navigateTo({
					url: '/pages/list/list?id=' + id,
				});
			},
			toSearchPage(){ 
				uni.navigateTo({
					url: "/pages/search/search"
				})
			}
		}
	}
</script>

<style scoped>
.index-search {
	margin: 0 30rpx;
	height: 70rpx;
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	margin: 70rpx 30rpx 30rpx;
}
.index-search text {
	font-size: 40rpx;
	margin: 0 28rpx 0 26rpx;
}
.index-search-inp {
	flex: 1;
	font-size: 28rpx;
}
.index-list {
	margin: 0 30rpx;
}
.index-list-item {
	display: flex;
	margin-bottom: 34rpx;
}
.list-item-img {
	width: 212rpx;
	height: 212rpx;
	border-radius: 30rpx;
	overflow: hidden;
	position: relative;
	margin-right: 22rpx;
}
.list-item-img image {
	width: 100%;
	height: 100%;
}
.list-item-img text {
	position: absolute;
	left: 12rpx;
	bottom: 16rpx;
	color: #fff;
	font-size: 20rpx;
}
.list-item-info {
	font-size: 24rpx;
	line-height: 70rpx;
}
.list-item-info view {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 450rpx;
}
</style>
