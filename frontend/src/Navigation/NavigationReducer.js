let initialState = {
	drawerOpen: false,
	drawerPermanent: false
}


export default (state = initialState, action) => {
	switch (action.type) {
		case "SET_DRAWER_STATE":
			return {...state, drawerOpen: action.open}
		default:
			return state
	}
}