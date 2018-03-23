let initialState = {
	loggedIn: false,
	info: null,
}


export default (state = initialState, action) => {
	switch (action.type) {
		case "SET_USER_INFO":
			return {info: action.info, loggedIn: !!action.info}
		default:
			return state
	}
}