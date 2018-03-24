import Axios from 'axios'

export const getRoutes = async (token) => {
	try{
		let result = await Axios.get("/api/routes", {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const getRoute = async (id, token) => {
	try{
		let result = await Axios.get("/api/routes/" + id, {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const addRoute = async (route, token) => {
	try{
		let result = await Axios.post("/api/routes", route, {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const setRoute = async (route, token) => {
	try{
		let result = await Axios.put("/api/routes", route, {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const deleteRoute = async (route, token) => {
	try{
		let result = await Axios.delete("/api/routes/" + route.id, {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export default {getRoute, getRoutes, addRoute, setRoute, deleteRoute}