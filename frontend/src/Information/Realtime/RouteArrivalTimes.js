import {runQuery} from "../HSLGraphQLDao";

let todaysTripsCache = new Map()

export const getTodaysTripsForRoute = async (routeId) => {
	if(todaysTripsCache.has(routeId)) {
		return todaysTripsCache.get(routeId)
	}
	let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
	let todayString = `${today.getFullYear()}${today.getMonth()+1 < 10 ? "0" + (today.getMonth()+1) : today.getMonth()+1}${today.getDate() < 10 ? "0" + today.getDate() : today.getDate()}`

	let query = `{
  route(id: "${routeId}") {
    trips{
      gtfsId
      activeDates
    }
  }
}`

	let response = await runQuery(query)
	let trips = response.data.route.trips
	let results = []
	for(let i = 0; i < trips.length; i++) {
		if(trips[i].activeDates.includes(todayString)) {
			results.push(trips[i].gtfsId)
		}
	}
	todaysTripsCache.set(routeId, results)
	return results
}



export const getTrip = async (tripId) => {

	let query = `{
  trip(id: "${tripId}") {
  	gtfsId
    stoptimes {
      realtimeArrival
      realtime
      stop{
        gtfsId
      }
    }
  }
}`

	let response = await runQuery(query)
	return response.data.trip
}