

export const setDrawerState = (open) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_DRAWER_STATE",
			open
		})
	}
}