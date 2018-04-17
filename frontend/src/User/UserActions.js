import RoutesLocalDao from "../Routes/RoutesLocalDao";
import {mapStartAndEndStopIdsToObjects} from "./UserFunctions";
import Actions from '../Actions'


export const setUser = (user) => {
	return async (dispatch) => {
		dispatch({
			type: "SET_USER_INFO",
			info: user
		})
		let routes
		if(user) {
			routes = await Promise.all(user.routes.map(mapStartAndEndStopIdsToObjects))
		} else {
			routes = await Promise.all((await RoutesLocalDao.getRoutes()).map(mapStartAndEndStopIdsToObjects))
		}
		dispatch(Actions.setRoutes(routes))

	}
}