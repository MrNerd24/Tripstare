import io from 'socket.io-client'
import Store from '../../Store'
import Actions from '../../Actions'
import {getStop} from "../Static/Stops";

let subscribedRoutes = []

let socket = io()
socket.on("updatedStoptime", async (stoptime) => {
	stoptime.startStop = await getStop(stoptime.startStop)
	stoptime.endStop = await getStop(stoptime.endStop)
	Store.dispatch(Actions.updateStoptime(stoptime))
})

socket.on('connect', () => {
	subscribedRoutes.forEach((route) => {
		subscribe(route)
	})
})

export const subscribe = (route) => {
	if(route.startStop && route.endStop && route.id) {
		subscribedRoutes.push(route)
		socket.emit('subscribe', route.startStop.gtfsId, route.endStop.gtfsId, route.id)
	}
}

export const unSubscribe = (route) => {
	if(route.id) {
		subscribedRoutes.splice(subscribedRoutes.findIndex((routesItem) => routesItem.id === route.id),1)
		socket.emit('unSubscribe', route.id)
	}
}

export const requestUpdate = (route) => {
	if(route.id) {
		socket.emit('updateTimes', route.id)
	}
}

export default {subscribe,unSubscribe, requestUpdate}