// import { BASE_URL } from "./config.js";

let BASE_URL = "/api"

/**
 * @param {String} url 路径
 * @param {String} method 请求方式
 */
export function request(url, method = "GET", data = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}${url}`,
			method: method,
			data: data,
			success: res => {
				resolve(res.data);
			},
		});
	})
}

/**
 * 榜单信息
 */
export function getTopList() {
	return request("/toplist/detail", "GET")
}

/**
 * 获取排行榜或歌单内容
 * @param {Object} id 排行榜或歌单Id
 */
export function getPlayList(id) {
	return request("/playlist/detail", "GET", {
		id
	})
}

/**
 * 获取歌曲详情
 * @param {Object} ids 歌曲Id
 */
export function songDetail(ids) {
	return request("/song/detail", "GET", {
		ids
	})
}

/**
 * 获取歌曲歌词信息
 * @param {Object} id 歌曲Id
 */
export function lyric(id) {
	return request("/lyric", "GET", {
		id
	})
}

/**
 * 获取相似歌曲
 * @param {Object} id 歌曲Id
 */
export function simiSongs(id) {
	return request("/simi/song", "GET", {
		id
	})
}

/**
 * 获取歌曲评论
 * @param {Object} id 歌曲Id
 */
export function musicComment(id) {
	return request("/comment/music", "GET", {
		id
	})
}

/**
 * 获取歌曲url
 * @param {Object} id 歌曲Id
 */
export function songUrl(id) {
	return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

/**
 * 获取热搜榜详情
 */
export function searchHotDetail() {
	return request("/search/hot/detail", "GET");
}

/**
 * 搜索歌曲
 * @param {Object} keywords 关键词
 */
export function search(keywords) {
	return request("/search", "GET", {
		keywords
	})
}

/**
 * 搜索推荐
 * @param {Object} keywords 关键词
 */
export function searchSuggest(keywords) {
	return request("/search/suggest", "GET", {
		keywords,
		type: "mobile"
	})
}
