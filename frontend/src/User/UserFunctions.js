import Store from '../Store'
import Actions from '../Actions'
import RoutesLocalDao from "../Routes/RoutesLocalDao";
import {getStop} from "../Information/Static/Stops";

export const initUser = async () => {
	if(!Store.getState().user.loggedIn) {
		let routes = await Promise.all((await RoutesLocalDao.getRoutes()).map(mapStartAndEndStopIdsToObjects));
		Store.dispatch(Actions.setRoutes(routes))
	}
}

export const mapStartAndEndStopIdsToObjects = async (route) => {
	route.startStop = getStop(route.startStop)
	route.endStop = getStop(route.endStop)
	route.startStop = await route.startStop
	route.endStop = await route.endStop
	return route
}