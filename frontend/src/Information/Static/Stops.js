import {runQuery} from "../HSLGraphQLDao";

let stops
let connectedStops = new Map()

export const getStops = async () => {
	if (stops) {
		return stops
	}

	let query = "{stops {gtfsId name desc code platformCode lat lon}}"

	let result = await runQuery(query)
	stops = result.data.stops.map(formatStop)
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
	let stops = parseUniqueStopsFromListOfRoutes(result.data.stop.routes).map(formatStop)
	connectedStops.set(gtfsId, stops)
	return stops
}

export const parseUniqueStopsFromListOfRoutes = (routes) => {
	let seenIds = new Set()
	let stops = []

	for(let i = 0; i < routes.length; i++) {
		for(let j = 0; j < routes[i].stops.length; j++) {
			let stop = routes[i].stops[j]
			if(!seenIds.has(stop.gtfsId)) {
				seenIds.add(stop.gtfsId)
				stops.push(stop)
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
		code, name, platformCode, desc
	}
}