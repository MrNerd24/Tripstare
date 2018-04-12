let connectedSockets = new Map()
let subscriptions = new Map()
let routeSubscribers = new Map()
let Emitter = require('./Emitter')

let intervalId = null

let addSocket = (socket) => {
	connectedSockets.set(socket.id, socket)
	setListeners(socket);
	if(connectedSockets.size === 1) {
		intervalId = setInterval(() => Emitter.emitUpdates(routeSubscribers, connectedSockets), 30000)
	}
}

let removeSocket = (socket) => {
	connectedSockets.delete(socket.id)
	removeAllSubscriptions(socket)
	if(connectedSockets.size === 0) {
		clearInterval(intervalId)
	}
}

let setListeners = (socket) => {
	socket.on('subscribe', (startStop, endStop) => {
		addToSubscriptions(socket.id, startStop, endStop);
		addToRouteSubscribers(startStop, endStop, socket.id);
	})

	socket.on('unSubscribe', (startStop, endStop) => {
		removeFromSubscriptions(socket.id, startStop, endStop);
		removeFromRouteSubscribers(startStop, endStop, socket.id);
	})

	socket.on('updateTimes', (startStop, endStop) => {
		Emitter.
	})
}

let addToSubscriptions = (socketId, startStop, endStop) => {
	if (!subscriptions.includes(socketId)) {
		subscriptions.set(socketId, [])
	}
	subscriptions.get(socketId).push({startStop, endStop})
}

let removeFromSubscriptions = (socketId, startStop, endStop) => {
	if (subscriptions.includes(socketId)) {
		let routes = subscriptions.get(socketId);
		routes.splice(routes.findIndex((route) => route.startStop === startStop && route.endStop === endStop), 1)
	}
}

let addToRouteSubscribers = (startStop, endStop, socketId) => {
	if (!routeSubscribers.includes(startStop)) {
		routeSubscribers.set(startStop, new Map())
	}
	if (!routeSubscribers.get(startStop).includes(endStop)) {
		routeSubscribers.get(startStop).set(endStop, [])
	}
	if (!routeSubscribers.get(startStop).get(endStop).find((socketsItem) => socketsItem === socketId)) {
		routeSubscribers.get(startStop).get(endStop).push(socketId)
	}
}

let removeFromRouteSubscribers = (startStop, endStop, socketId) => {
	if (routeSubscribers.includes(startStop)) {
		if (routeSubscribers.get(startStop).includes(endStop)) {
			let subscribers = routeSubscribers.get(startStop).get(endStop);
			subscribers.splice(subscribers.findIndex((subscriber) => subscriber === socketId), 1)
			if (subscribers.length === 0) {
				routeSubscribers.get(startStop).delete(endStop)
				if (routeSubscribers.get(startStop).size === 0) {
					routeSubscribers.delete(startStop)
				}
			}
		}
	}
}

let removeAllSubscriptions = (socketId) => {
	subscriptions.get(socketId).forEach((subscription) => {
		removeFromRouteSubscribers(subscription.startStop, subscription.endStop, socketId)
	})
	subscriptions.delete(socketId)
}

module.exports = {addSocket, removeSocket}