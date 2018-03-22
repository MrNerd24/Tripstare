export const addRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "ADD_ROUTE",
			route
		})
	}
}

export const editRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "EDIT_ROUTE",
			route
		})
	}
}