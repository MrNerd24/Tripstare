import Languages from './Languages'

let initialState = {
	height: 1080,
	width: 1920,
	language: Languages.finnish,
	notification: ""
}

export default (state = initialState, action) => {
	switch(action.type) {
		case "SET_SCREEN_SIZE":
			return {...state, height: action.height, width: action.width}
		case "SET_LANGUAGE":
			return {...state, language: action.language}
		case "SET_NOTIFICATION":
			return {...state, notification: action.notification}
		default:
			return state
	}
}