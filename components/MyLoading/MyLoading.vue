<template>
	<view class="loading" v-if="loading">
		loading...
	</view>
</template>

<script>
	export default {
		name:"MyLoading",
		data() {
			return {
				
			};
		},
		props: {
			loading: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style scoped>
.loading {
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	background-color: rgba(0, 0, 0, .3);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
