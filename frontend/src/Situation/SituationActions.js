import StoptimesDao from '../Information/Realtime/StoptimesDao'
import Store from '../Store'

export const addStoptime = (route) => {
	return async (dispatch) => {
		StoptimesDao.subscribe(route)
		let stoptime = {...route, justAdded: true}
		dispatch({
			type: "ADD_STOPTIME",
			stoptime
		})
	}
}

export const setStoptimes = (routes) => {
	return async (dispatch) => {
		Store.getState().situation.stoptimes.forEach((stoptime) => StoptimesDao.unSubscribe(stoptime))
		let stoptimes = routes.map((route) => {return {...route, justAdded:true}})
		stoptimes.forEach((stoptime) => {
			StoptimesDao.subscribe(stoptime)
		})
		dispatch({
			type: "SET_STOPTIMES",
			stoptimes
		})
	}
}

export const setStoptime = (route) => {
	return async (dispatch) => {
		StoptimesDao.unSubscribe(route)
		dispatch({
			type: "DELETE_STOPTIME",
			stoptime: route
		})
		StoptimesDao.subscribe(route)
		let stoptime = {...route, justAdded: true}
		dispatch({
			type: "ADD_STOPTIME",
			stoptime
		})
	}


}

export const updateStoptime = (stoptime) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_STOPTIME",
			stoptime
		})
	}
}

export const deleteStoptime = (route) => {
	return async (dispatch) => {
		StoptimesDao.unSubscribe(route)
		dispatch({
			type: "DELETE_STOPTIME",
			stoptime: route
		})
	}

}

export default {addStoptime, setStoptimes, updateStoptime, deleteStoptime, setStoptime}