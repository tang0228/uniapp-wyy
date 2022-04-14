import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		listIds: [],
		nextId: "",
	},
	mutations: {
		setListIds(state, payload) {
			state.listIds = payload;
		},
		setNextId(state, payload) {
			const index = state.listIds.findIndex(l => l.id == payload);
			if(index !== -1) {
				state.nextId = state.listIds[(index + 1) % state.listIds.length].id;
			}
		}
	}
})