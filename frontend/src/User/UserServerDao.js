import Axios from 'axios'

export const createUser = async (username, password) => {
	try{
		let data = {username, password}
		let result = await Axios.post("/api/users", data)
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}

}

export const loginWithUsernameAndPassword = async (username, password) => {
	try{
		let data={username, password}
		let result = await Axios.post("/api/users/login", data)
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const loginWithToken = async (token) => {
	try{
		let result = await Axios.post("/api/users/login",null, {headers: {"authorization" : "bearer " + token}})
		return result.data
	} catch (e) {
		if(e.response) {
			return e.response.data
		}
	}
}

export const usernameExists = async (username) => {
	try{
		let data = {username}
		let result = await Axios.post("/api/users/exists", data)
		return result.data.exists
	} catch (e) {
		console.log(e)
	}
}

export const setUserLanguage = async (language, token) => {
	try{
		let data = {language}
		Axios.post("/api/users/language",data, {headers: {"authorization" : "bearer " + token}})
	} catch (e) {
		console.log(e)
	}


}