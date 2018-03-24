let initialState = []


export default (state = initialState, action) => {
	switch (action.type) {
		case "ADD_ROUTE":
			return [...state, action.route];
		case "SET_ROUTE":
			return state.map((route) => route.id === action.route.id ? action.route : route)
		case "SET_ROUTES":
			return action.routes
		case "DELETE_ROUTE":
			return state.filter((route) => route.id !== action.id)
		default:
			return state
	}
}