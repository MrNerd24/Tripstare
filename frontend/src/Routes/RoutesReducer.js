let initialState = []


export default (state = initialState, action) => {
	switch (action.type) {
		case "ADD_ROUTE":
			return [...state, action.route];
		case "EDIT_ROUTE":
			return state.map((route) => route.id === action.route.id ? action.route : route)
		default:
			return state
	}
}