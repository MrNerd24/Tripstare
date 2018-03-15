import Languages from './Languages'

export const setScreenSize = (width, height) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_SCREEN_SIZE",
			width, height
		})
	}
}

export const setLanguage = (language) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_LANGUAGE",
			language: Languages[language]
		})
	}
}