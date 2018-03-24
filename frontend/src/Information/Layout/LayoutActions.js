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
			language: Languages[language],
			languageValue: language
		})
	}
}

let notificationTimeout = null

export const setNotification = (message) => {
	return async (dispatch) => {
		if(notificationTimeout) {
			clearTimeout(notificationTimeout)
		}

		dispatch({
			type: "SET_NOTIFICATION",
			notification: message
		})

		notificationTimeout = setTimeout(() => {
			dispatch({
				type: "SET_NOTIFICATION",
				notification: ""
			})
		}, 5000)
	}
}