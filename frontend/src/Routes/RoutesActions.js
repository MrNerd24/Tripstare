import Actions from '../Actions'

export const addRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "ADD_ROUTE",
			route
		})
		dispatch(Actions.addStoptime(route))
	}
}

export const setRoute = (route) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_ROUTE",
			route
		})
		dispatch(Actions.setStoptime(route))
	}
}

export const setRoutes = (routes) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_ROUTES",
			routes
		})
		dispatch(Actions.setStoptimes(routes))
	}
}

export const deleteRoute = (id) => {
	return async (dispatch) => {
		dispatch({
			type: "DELETE_ROUTE",
			id
		})
		dispatch(Actions.deleteStoptime({id}))
	}
}