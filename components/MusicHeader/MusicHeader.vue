<template>
	<view class="music-header" :style="{color: textColor}">
		<view v-if="flag" class="header-icon-wrap">
			<text class="iconfont icon-arrow-left" @tap="backToPrev"></text>
			|
			<text class="iconfont icon-home" @tap="backToHome"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	export default {
		name:"MusicHeader",
		data() {
			return {
				
			};
		},
		props: {
			title: {
				type: String,
				required: true,
			},
			flag: {
				type: Boolean,
				default: true
			},
			textColor: {
				type: String
			}
		},
		methods: {
			backToPrev() {
				uni.navigateBack()
			},
			backToHome() {
				uni.navigateTo({
					url:"../../pages/index/index"
				})
			}
		}
	}
</script>

<style scoped>
.music-header {
	width: 100%;
	height: 70px;
	position: relative;
	text-align: center;
	line-height: 80px;
	font-size: 16px;
	color: #000;
}
.header-icon-wrap {
	position: absolute;
	width: 90px;
	height: 31px;
	background-color: rgba(0, 0, 0, .4);
	color: #fff;
	top: 26px;
	left: 16px;
	line-height: 31px;
	border-radius: 15px;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
}
</style>
