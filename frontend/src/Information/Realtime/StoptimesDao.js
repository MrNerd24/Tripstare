import io from 'socket.io-client'
import Store from '../../Store'
import Actions from '../../Actions'
import {getStop} from "../Static/Stops";

let socket = io()
socket.on("updatedStoptime", async (stoptime) => {
	stoptime.startStop = await getStop(stoptime.startStop)
	stoptime.endStop = await getStop(stoptime.endStop)
	Store.dispatch(Actions.updateStoptime(stoptime))
})

export const subscribe = (route) => {
	if(route.startStop && route.endStop && route.id) {
		socket.emit('subscribe', route.startStop.gtfsId, route.endStop.gtfsId, route.id)
	}
}

export const unSubscribe = (route) => {
	if(route.id) {
		socket.emit('unSubscribe', route.id)
	}
}

export const requestUpdate = (route) => {
	if(route.id) {
		socket.emit('updateTimes', route.id)
	}
}

export default {subscribe,unSubscribe, requestUpdate}