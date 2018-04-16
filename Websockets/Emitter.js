let runQuery = require('./HSLGraphQLDao').runQuery

let stopTimes = new Map()
let routesBetweenStops = new Map()

let stopTimesAlreadyCalculated = (startStop, endStop) => {
	if (stopTimes.has(startStop)) {
		if (stopTimes.get(startStop).has(endStop)) {
			if (stopTimes.get(startStop).get(endStop).length > 1) {
				return true
			}
		}
	}
	return false
}

let getTripStoptimesData = async (stoptime) => {
	stoptime = await stoptime
	let todayString = getTodayString()
	let query = `{
  trip(id:"${stoptime.trip}") {
    stoptimesForDate(serviceDate: "${todayString}") {
      scheduledArrival
      arrivalDelay
      serviceDay
      realtime
      stop {
        gtfsId
      }
    }
  }
}`

	let response = await runQuery(query)
	return response.data.trip.stoptimesForDate
}


let updateStopTime = async (stoptime) => {

	let today = getTodayDate()

	let stoptimesData = await getTripStoptimesData(stoptime);

	if(!stoptimesData) {
		return stoptime
	}
	let startStoptime = stoptimesData.find((stoptimesItem) => stoptimesItem.stop.gtfsId === stoptime.startStop)
	let endStoptime = stoptimesData.find((stoptimesItem) => stoptimesItem.stop.gtfsId === stoptime.endStop)
	if (startStoptime && endStoptime) {
		let update = {
			departureTime: today.getTime() + startStoptime.scheduledArrival * 1000 + startStoptime.arrivalDelay * 1000,
			arrivalTime: today.getTime() + endStoptime.scheduledArrival * 1000 + endStoptime.arrivalDelay * 1000,
			realtime: startStoptime.realtime
		}
		if (update.departureTime > update.arrivalTime) {
			update.arrivalTime = update.arrivalTime + 86400000
		}
		return {...stoptime, ...update}
	} else {
		return stoptime
	}
}

let updateSoonestStopTimes = async (neededStopTimes) => {
	for(let i = neededStopTimes.length-1; i >= Math.max(neededStopTimes.length-5,0); i--) {
		let stoptimeToBeUpdated = await neededStopTimes[i];
		neededStopTimes[i] = updateStopTime(stoptimeToBeUpdated)
	}
	let updatedStoptimes = await Promise.all(neededStopTimes);
	updatedStoptimes.sort((a, b) => b.arrivalTime - a.arrivalTime)
	return updatedStoptimes

}

let emitFromCalculatedStoptimes = async (socketIds, connectedSockets, startStop, endStop) => {
	let neededStopTimes = stopTimes.get(startStop).get(endStop)
	let updatedStopTimes = await updateSoonestStopTimes(neededStopTimes)
	while((await updatedStopTimes[updatedStopTimes.length-1]).departureTime <= Date.now()) {
		updatedStopTimes.pop()
	}
	let latest = updatedStopTimes[updatedStopTimes.length-1]
	stopTimes.get(startStop).set(endStop, updatedStopTimes)
	socketIds.forEach((socketId) => {
		let socket = connectedSockets.get(socketId.socketId)
		socket.emit("updatedStoptime", {...latest, id: socketId.id})
	})
}

let getTodayDate = () => {
	return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
}


let getTodayString = () => {
	let today = getTodayDate();
	return `${today.getFullYear()}${today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`
}

let getStoptimesData = async (startStop) => {

	let todayString = getTodayString();

	let query = `{
  stop(id: "${startStop}") {
    stoptimesForServiceDate(date: "${todayString}") {
      pattern{
        route{
          gtfsId
          shortName
        }
      }
      stoptimes{
        scheduledArrival
        arrivalDelay
        serviceDay
        trip {
          gtfsId
          stoptimesForDate(serviceDate: "${todayString}") {
            stop{
              gtfsId
            }
            scheduledArrival
            arrivalDelay
            realtime
            serviceDay
          }
        }
      }
    }
  }
}`
	return (await runQuery(query)).data
}

let getStopsRouteData = async (startStop) => {
	let query = `{
  stop(id :"${startStop}") {
    routes{
      gtfsId
      stops{
        gtfsId
      }
    }
  }
}`
	let result = await runQuery(query)
	let routes = result.data.stop.routes
	return routes;
}

let calculateRoutesBetweenStops = (routes, endStop) => {
	let connectedRoutesIds = []
	for (let i = 0; i < routes.length; i++) {
		let gtfsId = routes[i].gtfsId
		let endStopfound = false
		for (let j = 0; j < routes[i].stops.length; j++) {
			if (routes[i].stops[j].gtfsId === endStop) {
				endStopfound = true
				break
			}
		}
		if (endStopfound) {
			connectedRoutesIds.push(gtfsId)
		}
	}
	return connectedRoutesIds
};
let getRoutesBetweenStops = async (startStop, endStop) => {
	if(routesBetweenStops.has(startStop)) {
		if(routesBetweenStops.get(startStop).has(endStop)) {
			return routesBetweenStops.get(startStop).get(endStop)
		}
	}
	let routes = await getStopsRouteData(startStop);
	let calculatedRoutes = calculateRoutesBetweenStops(routes, endStop);
	if(!routesBetweenStops.has(startStop)) {
		routesBetweenStops.set(startStop, new Map())
	}
	routesBetweenStops.get(startStop).set(endStop,calculatedRoutes)
	return calculatedRoutes
}

let calculateStopTimes = async (stoptimesData, startStop, endStop) => {
	let stoptimeCollections = stoptimesData.stop.stoptimesForServiceDate
	let results = []
	let routeIds = await getRoutesBetweenStops(startStop, endStop)
	for (let i = 0; i < stoptimeCollections.length; i++) {
		let stoptimes = stoptimeCollections[i].stoptimes
		let route = stoptimeCollections[i].pattern.route.gtfsId
		let routeName = stoptimeCollections[i].pattern.route.shortName
		if (routeIds.includes(route)) {
			for (let j = 0; j < stoptimes.length; j++) {
				let departureTime = stoptimes[j].serviceDay * 1000 + stoptimes[j].scheduledArrival * 1000 + stoptimes[j].arrivalDelay * 1000
				if (departureTime > Date.now()) {
					let realtime = stoptimes[j].realtime
					let trip = stoptimes[j].trip.gtfsId
					let arrivalTime = null

					let stoptimesOfTrip = stoptimes[j].trip.stoptimesForDate;
					let startStopInTripFound = false
					for (let k = 0; k < stoptimesOfTrip.length; k++) {
						if (stoptimesOfTrip[k].stop.gtfsId === startStop) {
							startStopInTripFound = true
						}
						if (startStopInTripFound && stoptimesOfTrip[k].stop.gtfsId === endStop) {
							arrivalTime = stoptimesOfTrip[k].serviceDay * 1000 + stoptimesOfTrip[k].scheduledArrival * 1000 + stoptimesOfTrip[k].arrivalDelay * 1000
							break
						}
					}
					if (!arrivalTime) {
						continue
					}

					let stoptime = {startStop, endStop, departureTime, arrivalTime, route, routeName, realtime, trip};
					results.push(stoptime)

				}

			}
		}

	}
	results.sort((a, b) => b.arrivalTime - a.arrivalTime)
	console.log(results.slice(-5))
	return results
}

let addToStopTimes = async (stoptimesData, startStop, endStop) => {
	let newStopTimeList = await calculateStopTimes(stoptimesData, startStop, endStop);
	if(!stopTimes.has(startStop)) {
		stopTimes.set(startStop, new Map())
	}
	stopTimes.get(startStop).set(endStop, newStopTimeList)
}

let emitSingleUpdate = (startStop, endStop, routeSubscribers, connectedSockets) => {
	emitUpdate(startStop, endStop, null, routeSubscribers, connectedSockets)
}

let emitUpdate = async (startStop, endStop, stoptimesData, routeSubscribers, connectedSockets) => {
	if (!stopTimesAlreadyCalculated(startStop, endStop)) {
		if (!stoptimesData) {
			stoptimesData = await getStoptimesData(startStop)
		}
		await addToStopTimes(stoptimesData, startStop, endStop)
	}
	let socketIds = routeSubscribers.get(startStop).get(endStop)
	emitFromCalculatedStoptimes(socketIds, connectedSockets, startStop, endStop)
}


let emitUpdates = async (routeSubscribers, connectedSockets) => {
	for (let startStop of routeSubscribers.keys()) {
		let stoptimesData = null
		for (let endStop of routeSubscribers.get(startStop).keys()) {
			await emitUpdate(startStop, endStop, stoptimesData, routeSubscribers, connectedSockets);
		}
	}
}


module.exports = {emitUpdates, emitSingleUpdate}