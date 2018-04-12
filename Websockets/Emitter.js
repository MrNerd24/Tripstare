let runQuery = require('./HSLGraphQLDao').runQuery

let stopTimes = new Map()
let routesBetweenStops = new Map()

let stopTimesAlreadyCalculated = (startStop, endStop) => {
	if (stopTimes.includes(startStop)) {
		if (stopTimes.get(startStop).includes(endStop)) {
			if (stopTimes.get(startStop).get(endStop).length > 0) {
				return true
			}
		}
	}
	return false
}

let emitFromCalculatedStoptimes = (connectedSockets, startStop, endStop) => {
	let neededStopTimes = stopTimes.get(startStop).get(endStop)

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

let getRoutesBetweenStops = async (startStop, endStop) => {
	let routes = await getStopsRouteData(startStop);
	let connectedRoutesIds = []
	for(let i = 0; i < routes.length; i++) {
		let gtfsId = routes[i].gtfsId
		let endStopfound = false
		for(let j = 0; j < routes[i].stops.length; j++) {
			if(routes[i].stops[j].gtfsId === endStop) {
				endStopfound=true
				break
			}
		}
		if(endStopfound) {
			connectedRoutesIds.push(gtfsId)
		}
	}
	return connectedRoutesIds
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
	return results
}

let addToStopTimes = async (stoptimesData, startStop, endStop) => {
	let newStopTimeList = await calculateStopTimes(stoptimesData, startStop, endStop);
	if(!stopTimes.includes(startStop)) {
		stopTimes.set(startStop, new Map())
	}
	stopTimes.get(startStop).set(endStop, newStopTimeList)
}

let emitUpdates = async (routeSubscribers, connectedSockets) => {
	for (let startStop of routeSubscribers.keys()) {
		let stoptimesData = null
		for (let endStop of routeSubscribers.get(startStop).keys()) {
			if (!stopTimesAlreadyCalculated(startStop, endStop)) {
				if (!stoptimesData) {
					stoptimesData = await getStoptimesData(startStop)
				}
				await addToStopTimes(stoptimesData, startStop, endStop)
			}
			emitFromCalculatedStoptimes(connectedSockets, startStop, endStop)
		}
	}
}


module.exports = {emitUpdates}