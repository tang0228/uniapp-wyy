<script>
	import "@/common/iconfont.css";
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
.container {
	height: calc(100vh - 70px);
	overflow: hidden;
	width: 100%;
}
.container2 {
	height: calc(100vh - 165px);
	overflow: hidden;
	width: 100%;
}
.container scroll-view, .container2 scroll-view {
	height: 100%;
}
/* 背景图样式 */
.fixbg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background: url(static/logo.png);
	background-size: cover;
	background-position: center 0; 
	filter: blur(20px);
	transform: scale(1.2);
}
</style>
