let initialState = {
	stoptimes: []
}


export default (state = initialState, action) => {
	switch (action.type) {
		case "ADD_STOPTIME":
			return {...state, stoptimes: [...state.stoptimes, action.stoptime]};
		case "SET_STOPTIME":
			return {...state, stoptimes: state.stoptimes.map((stoptime) => stoptime.id === action.stoptime.id ? action.stoptime : stoptime)}
		case "SET_STOPTIMES":
			return {...state, stoptimes: action.stoptimes}
		case "DELETE_STOPTIME":
			return {...state, stoptimes: state.stoptimes.filter((stoptime) => stoptime.id !== action.stoptime.id)}
		default:
			return state
	}
}