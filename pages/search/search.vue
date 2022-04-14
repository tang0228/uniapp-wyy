<template>
	<view class="search">
		<MusicHeader title="网易云音乐" :flag="true"></MusicHeader>
		<view class="search-search">
			<text class="iconfont icon-search"></text>
			<input class="search-search-inp" @confirm="handleSearch" @input="handleSuggest" v-model="keywords" type="text" placeholder="搜索歌曲">
			<text v-if="searchType !== 1" class="iconfont icon-guanbi" @tap="clearInp"></text>
		</view>
		<view class="container2">
			<scroll-view scroll-y="true" >
				<block v-if="searchType === 1">
					<view class="search-history" v-if="searchHistory.length">
						<view class="history-head">
							<text>历史记录</text>
							<text class="iconfont icon-shanchu" @tap="clearHistory"></text>
						</view>
						<view class="history-list">
							<view v-for="(sh, i) in searchHistory" :key="i" @tap="wordClick(sh)">{{sh}}</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="hot-head">
							热搜榜
						</view>
						<view class="hot-list">
							<view class="hot-list-item" v-for="(h, i) in hotList" :key="i" @tap="wordClick(h.searchWord)">
								<view class="item-index" :class="{'top-color': i < 3}">{{i+1}}</view>
								<view class="item-info">
									<text class="item-word">{{h.searchWord}}</text>
									<image v-if="h.iconUrl" :src="h.iconUrl" mode=""></image>
									<view class="item-desc" v-if="h.content">{{h.content}}</view>
								</view>
								<view class="item-num">{{h.score}}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else-if="searchType === 2">
					<view class="search-result">
						<view class="result-item" v-for="s in searchList" :key="s.id" @tap="toSongDetailPage(s.id)">
							<view class="result-item-info">
								<view>{{s.name}}</view>
								<view>{{s.artists[0].name}} - {{s.album.name}}</view>
							</view>
							<text class="iconfont icon-play"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType === 3">
					<view class="search-suggest">
						<view class="suggest-head">搜索“{{keywords}}”</view>
						<view class="suggest-item" v-for="(sug, index) in suggestList" :key="index" @tap="wordClick(sug.keyword)">
							<text class="iconfont icon-search"></text>
							{{sug.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from "@/components/MusicHeader/MusicHeader.vue";
	import { searchHotDetail, search, searchSuggest } from "@/common/apis.js";
	
	const HISTORY_KEY = "search-history";
	
	export default {
		data() {
			return {
				hotList: [],
				keywords: "",
				searchHistory: [],
				searchType: 1,
				searchList: [],
				suggestList: [],
			}
		},
		components: {
			MusicHeader
		},
		onLoad() {
			uni.getStorage({
				key: HISTORY_KEY,
				success: res => {
					this.searchHistory = res.data;
				}
			})
			this.getSearchHotDetail();
		},
		methods: {
			getSearchHotDetail() {
				searchHotDetail().then(res => {
					if(res.code === 200) {
						this.hotList = res.data;
					}
				})
			},
			wordClick(val) {
				this.keywords = val;
				this.getSearchList();
			},
			handleSearch() {
				this.searchHistory.unshift(this.keywords);
				this.searchHistory = [...new Set(this.searchHistory)];
				if(this.searchHistory.length > 10) {
					this.searchHistory.length = 10;
				}
				uni.setStorage({
					key: HISTORY_KEY,
					data: this.searchHistory,
				});
				this.getSearchList();
			},
			clearHistory() {
				uni.removeStorage({
					key: HISTORY_KEY,
					success: res => {
						this.searchHistory = [];
					}
				})
			},
			getSearchList() {
				uni.showLoading({
					title: "加载中",
				});
				search(this.keywords).then(res => {
					this.searchList = res.result.songs;
					this.searchType = 2;
					uni.hideLoading();
				})
			},
			toSongDetailPage(id) {
				uni.navigateTo({
					url: "/pages/SongDetail/SongDetail?id=" + id
				})
			},
			clearInp() {
				this.keywords = "";
				this.searchType = 1;
			},
			handleSuggest(e) {
				let val = e.detail.value;
				if(!val) {
					this.searchType = 1;
					return;
				}
				searchSuggest(val).then(res => {
					if(res.code === 200) {
						this.searchType = 3;
						this.suggestList = res.result.allMatch;
					}
				})
			}
		}
	}
</script>

<style scoped>
.search-search {
	margin: 0 30rpx;
	height: 70rpx;
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	background-color: #f7f7f7;
	margin: 70rpx 30rpx 50rpx;
}
.search-search text {
	font-size: 40rpx;
	margin: 0 28rpx 0 26rpx;
}
.search-search-inp {
	flex: 1;
	font-size: 28rpx;
}
.search-history {
	margin: 0 30rpx 50rpx;
	font-size: 28rpx;
}
.history-head {
	display: flex;
	justify-content: space-between;
	margin-bottom: 36rpx;
}
.history-list {
	display: flex;
	flex-wrap: wrap;
}
.history-list view {
	padding: 16rpx 26rpx;
	border-radius: 40rpx;
	background-color: #f7f7f7;
	margin-right: 30rpx;
	margin-bottom: 20rpx;
}
.search-hot {
	margin: 0 30rpx;
	font-size: 26rpx;
	padding-bottom: 20rpx;
}
.hot-head {
	margin-bottom: 36rpx;
	font-size: 28rpx;
}
.hot-list-item {
	display: flex;
	align-items: center;
	margin-bottom: 58rpx;
	
}
.item-index {
	color: #878787;
	width: 60rpx;
	margin-left: 8rpx;
}
.top-color {
	color: #fb2222;
}
.item-word {
	font-size: 30rpx;
	color: #000;
	padding-right: 10rpx;
}
.item-desc {
	color: #878787;
	font-size: 24rpx;
	width: 500rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-top: 8rpx;
}
.item-info {
	flex: 1;
}
.item-info image {
	width: 48rpx;
	height: 42rpx;
	vertical-align: bottom;
}
.item-num {
	color: #878787;
}
.search-result {
	padding: 0 30rpx;
}
.result-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 0;
	border-bottom: 2rpx solid #e4e4e4;
}
.result-item-info view:nth-child(1) {
	font-size: 28rpx;
	color: #235790;
	margin-bottom: 12rpx;
}
.result-item-info view:nth-child(2) {
	font-size: 22rpx;
	color: #898989;
}
.result-item text {
	font-size: 60rpx;
}
.search-suggest {
	padding: 0 30rpx;
}
.suggest-head {
	color: #4574a5;
	margin-bottom: 74rpx;
}
.suggest-item {
	color: #5d5d5d;
	margin-bottom: 74rpx;
}
.suggest-item text {
	color: #bdbdbd;
	margin-right: 28rpx;
	font-size: 40rpx;
	position: relative;
	top: 4rpx;
}
</style>
