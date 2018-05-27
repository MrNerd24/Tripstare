import {runQuery} from "../HSLGraphQLDao";

let stops
let connectedStops = new Map()

export const getStops = async () => {
	if (stops) {
		return stops
	}
	stops = new Promise((resolve, reject) => {
		let query = "{stops {gtfsId name desc code platformCode lat lon}}"
		runQuery(query).then((result) => {
			resolve(result.data.stops.map(formatStop))
		})
	})
	return stops
}

export const getStop = async (gtfsId) => {
	if(gtfsId) {
		let stops = await getStops()
		return stops.find((stop) => stop.gtfsId === gtfsId)
	}
	return null

}

export const getConnectedStops = async (gtfsId) => {

	if(connectedStops.has(gtfsId)) {
		return connectedStops.get(gtfsId)
	}


	let query = `{
  stop(id :"${gtfsId}") {
    routes{
      stops{
        gtfsId
    	name
    	platformCode
		desc
    	code
      }
    }
  }
}`

	let result = await runQuery(query)
	let stops = parseUniqueStopsFromListOfRoutes(result.data.stop.routes, gtfsId).map(formatStop)
	connectedStops.set(gtfsId, stops)
	return stops
}

export const parseUniqueStopsFromListOfRoutes = (routes, startStopId) => {
	let seenIds = new Set()
	let stops = []

	for(let i = 0; i < routes.length; i++) {
		let startStopSeen = false;
		for(let j = 0; j < routes[i].stops.length; j++) {
			let stop = routes[i].stops[j]
			if(startStopSeen) {
				if(!seenIds.has(stop.gtfsId)) {
					seenIds.add(stop.gtfsId)
					stops.push(stop)
				}
			} else {
				if(stop.gtfsId === startStopId) {
					startStopSeen = true;
				}
			}

		}
	}
	return stops
}

export const formatStop = (stop) => {
	let code = stop.code ? stop.code + " " : "";
	let name = stop.name ? stop.name + " " : "";
	let platformCode = stop.platformCode ? stop.platformCode + " " : "";
	let desc = stop.desc ? stop.desc : "";

	return {
		gtfsId: stop.gtfsId,
		value: stop.gtfsId,
		text: `${code}${name}${platformCode}${desc}`,
		code, name, platformCode, desc,
		latitude: stop.lat,
		longitude: stop.lon
	}
}