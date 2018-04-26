
let initialState = {
	locationKnown: false,
	latitude: 0,
	longitude: 0,
}

export default (state = initialState, action) => {
	switch(action.type) {
		case "SET_LOCATION_KNOWN":
			return {...state, locationKnown: action.known}
		case "SET_LOCATION":
			return {...state, latitude: action.latitude, longitude: action.longitude}
		default:
			return state
	}
}