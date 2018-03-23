import {createUser} from "./UserServerDao";


export const addUser = (username, password) => {
	return async (dispatch) => {
		let user = await createUser(username, password)
		dispatch({
			type: "SET_USER_INFO",
			info: user
		})
	}
}