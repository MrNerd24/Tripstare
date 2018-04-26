

export const setLocationKnown = (known) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_LOCATION_KNOWN",
			known
		})
	}
}

export const setLocation = (latitude, longitude) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_LOCATION",
			latitude, longitude
		})
	}
}