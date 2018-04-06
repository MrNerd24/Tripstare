import {runQuery} from "../HSLGraphQLDao";


export const getTodaysStoptimesForStop = async (stopId, routeIds) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth()+1 < 10 ? "0" + (today.getMonth()+1) : today.getMonth()+1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

	let query = `{
  stop(id: "${stopId}") {
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
        }
      }
    }
  }
}`

	let response = await runQuery(query)
	let stoptimeCollections = response.data.stop.stoptimesForServiceDate
	let results = []
	for(let i = 0; i < stoptimeCollections.length; i++) {
		let stoptimes = stoptimeCollections[i].stoptimes
		let route = stoptimeCollections[i].pattern.route.gtfsId
		let routeName = stoptimeCollections[i].pattern.route.shortName
		if(!routeIds || routeIds.includes(route)) {
			for(let j = 0; j < stoptimes.length; j++) {
				let time = stoptimes[j].serviceDay*1000 + stoptimes[j].scheduledArrival*1000+stoptimes[j].arrivalDelay * 1000
				let realtime = undefined
				let trip = stoptimes[j].trip.gtfsId
				if(time > Date.now())
					results.push({time, route, routeName, realtime, trip})
			}
		}

	}
	results.sort((a,b) => b.time - a.time)
	return results
}

export const getArrivalTime = async (tripId, stopId) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth()+1 < 10 ? "0" + (today.getMonth()+1) : today.getMonth()+1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

	let query = `{
  trip(id:"${tripId}") {
    stoptimesForDate(serviceDate: "${todayString}") {
      scheduledArrival
      arrivalDelay
      serviceDay
      stop {
        gtfsId
      }
    }
  }
}`

	let response = await runQuery(query)
	let stoptimes = response.data.trip.stoptimesForDate
	let stoptime = stoptimes.find((stoptimesItem) => stoptimesItem.stop.gtfsId === stopId)
	if(stoptime) {
		return stoptime.serviceDay*1000 + stoptime.scheduledArrival*1000 + stoptime.arrivalDelay * 1000
	} else {
		return -1
	}

}

export const isRealtime = async (tripId, stopId) => {
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth()+1 < 10 ? "0" + (today.getMonth()+1) : today.getMonth()+1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

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
	if(stoptime) {
		return stoptime.realtime
	} else {
		return false
	}
}


