let connectedSockets = new Map()
let subscriptions = new Map()
let routeSubscribers = new Map()
let Emitter = require('./Emitter')

let intervalId = setInterval(() => Emitter.emitUpdates(routeSubscribers, connectedSockets), 30000)

let addSocket = (socket) => {
	connectedSockets.set(socket.id, socket)
	setListeners(socket);
}

let removeSocket = (socket) => {
	connectedSockets.delete(socket.id)
	removeAllSubscriptions(socket.id)
}

let setListeners = (socket) => {
	socket.on('subscribe', (startStop, endStop, id) => {
		addToSubscriptions(socket.id, startStop, endStop, id);
		addToRouteSubscribers(startStop, endStop, socket.id, id);
		Emitter.emitSingleUpdate(startStop, endStop, routeSubscribers, connectedSockets)
	})

	socket.on('unSubscribe', (id) => {
		removeFromRouteSubscribers(id, socket.id);
		removeFromSubscriptions(socket.id, id);
	})

	socket.on('updateTimes', (id) => {
		let {startStop, endStop} = subscriptions.get(socket.id).find((route) => route.id === id)
		Emitter.emitSingleUpdate(startStop, endStop, routeSubscribers, connectedSockets)
	})
}

let addToSubscriptions = (socketId, startStop, endStop, id) => {
	if (!subscriptions.has(socketId)) {
		subscriptions.set(socketId, [])
	}
	if(!subscriptions.get(socketId).find((stops) => stops.id === id))
	subscriptions.get(socketId).push({startStop, endStop, id})
}

let removeFromSubscriptions = (socketId, id) => {
	if (subscriptions.has(socketId)) {
		let routes = subscriptions.get(socketId);
		routes.splice(routes.findIndex((route) => route.id === id ), 1)
	}
}

let addToRouteSubscribers = (startStop, endStop, socketId, id) => {
	if (!routeSubscribers.has(startStop)) {
		routeSubscribers.set(startStop, new Map())
	}
	if (!routeSubscribers.get(startStop).has(endStop)) {
		routeSubscribers.get(startStop).set(endStop, [])
	}
	if (!routeSubscribers.get(startStop).get(endStop).find((socketsItem) => socketsItem.socketId === socketId)) {
		routeSubscribers.get(startStop).get(endStop).push({socketId,id})
	}
}

let removeFromRouteSubscribers = (id, socketId) => {
	if(subscriptions.has(socketId)) {
		let routes = subscriptions.get(socketId)
		let {startStop, endStop} = routes.find((route) => route.id === id)
		if (routeSubscribers.has(startStop)) {
			if (routeSubscribers.get(startStop).has(endStop)) {
				let subscribers = routeSubscribers.get(startStop).get(endStop);
				subscribers.splice(subscribers.findIndex((subscriber) => subscriber.socketId === socketId), 1)
				if (subscribers.length === 0) {
					routeSubscribers.get(startStop).delete(endStop)
					if (routeSubscribers.get(startStop).size === 0) {
						routeSubscribers.delete(startStop)
					}
				}
			}
		}
	}

}

let removeAllSubscriptions = (socketId) => {
	if(subscriptions.has(socketId)) {
		subscriptions.get(socketId).forEach((subscription) => {
			removeFromRouteSubscribers(subscription.id, socketId)
		})
		subscriptions.delete(socketId)
	}
}

module.exports = {addSocket, removeSocket}