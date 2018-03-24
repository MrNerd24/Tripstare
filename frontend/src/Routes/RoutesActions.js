export const addRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "ADD_ROUTE",
			route
		})
	}
}

export const setRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_ROUTE",
			route
		})
	}
}

export const setRoutes = (routes) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_ROUTES",
			routes
		})
	}
}

export const deleteRoute = (id) => {
	return async (dispatch) => {
		dispatch({
			type: "DELETE_ROUTE",
			id
		})
	}
}