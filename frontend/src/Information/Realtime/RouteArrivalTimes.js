import {runQuery} from "../HSLGraphQLDao";
import io from 'socket.io-client'

let socket = io()


export const getTodaysStoptimesForStop = async (startStop, endStop, routeIds) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

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

	let response = await runQuery(query)
	let stoptimeCollections = response.data.stop.stoptimesForServiceDate
	let results = []


	for (let i = 0; i < stoptimeCollections.length; i++) {
		let stoptimes = stoptimeCollections[i].stoptimes
		let route = stoptimeCollections[i].pattern.route.gtfsId
		let routeName = stoptimeCollections[i].pattern.route.shortName
		if (!routeIds || routeIds.includes(route)) {
			for (let j = 0; j < stoptimes.length; j++) {
				let departureTime = stoptimes[j].serviceDay * 1000 + stoptimes[j].scheduledArrival * 1000 + stoptimes[j].arrivalDelay * 1000
				let realtime = stoptimes[j].realtime
				let trip = stoptimes[j].trip.gtfsId
				let arrivalTime = null

				let stoptimesOfTrip = stoptimes[j].trip.stoptimesForDate;
				let endTimeFound = false
				for (let k = 0; k < stoptimesOfTrip.length; k++) {
					if (stoptimesOfTrip[k].stop.gtfsId === endStop) {
						arrivalTime = stoptimesOfTrip[k].serviceDay * 1000 + stoptimesOfTrip[k].scheduledArrival * 1000 + stoptimesOfTrip[k].arrivalDelay * 1000
						endTimeFound = true
						break
					}
				}
				if (!endTimeFound) {
					continue
				}
				if (departureTime > Date.now()) {
					let stoptime = {departureTime, arrivalTime, route, routeName, realtime, trip};
					results.push(stoptime)
				}
			}
		}

	}
	results.sort((a, b) => b.arrivalTime - a.arrivalTime)
	return results
}


export const getUpdatedTimes = async (tripId, startStop, endStop) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

	let query = `{
  trip(id:"${tripId}") {
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
	let stoptimes = response.data.trip.stoptimesForDate
	let startStoptime = stoptimes.find((stoptimesItem) => stoptimesItem.stop.gtfsId === startStop)
	let endStoptime = stoptimes.find((stoptimesItem) => stoptimesItem.stop.gtfsId === endStop)
	if (startStoptime && endStoptime) {
		let update = {
			departureTime: today.getTime() + startStoptime.scheduledArrival * 1000 + startStoptime.arrivalDelay * 1000,
			arrivalTime: today.getTime() + endStoptime.scheduledArrival * 1000 + endStoptime.arrivalDelay * 1000,
			realtime: startStoptime.realtime
		}
		if (update.departureTime > update.arrivalTime) {
			update.arrivalTime = update.arrivalTime + 86400000
		}
		return update
	}

}

export const isRealtime = async (tripId, stopId) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

	let query = `{
  trip(id:"${tripId}") {
    stoptimesForDate(serviceDate: "${todayString}") {
      realtime
      stop {
        gtfsId
      }
    }
  }
}`

	let response = await runQuery(query)
	let stoptimes = response.data.trip.stoptimesForDate
	let stoptime = stoptimes.find((stoptimesItem) => stoptimesItem.stop.gtfsId === stopId)
	if (stoptime) {
		return stoptime.realtime
	} else {
		return false
	}
}

export const getTrip = (tripId) => {

}


