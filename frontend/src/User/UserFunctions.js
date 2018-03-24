import Store from '../Store'
import Actions from '../Actions'
import RoutesLocalDao from "../Routes/RoutesLocalDao";
import {getStop} from "../Information/Static/Stops";
import LocalForage from 'localforage'
import {loginWithToken} from "./UserServerDao";
import RoutesServerDao from "../Routes/RoutesServerDao";

export const initUser = async () => {
	let token = await LocalForage.getItem("token")
	if(token) {
		let user = await loginWithToken(token)
		if(user.username) {
			Store.dispatch(Actions.setUser(user))
		}
		let routes = await Promise.all((await RoutesServerDao.getRoutes(token)).map(mapStartAndEndStopIdsToObjects));
		Store.dispatch(Actions.setRoutes(routes))
		Store.dispatch(Actions.setLanguage(user.language))
	} else {
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