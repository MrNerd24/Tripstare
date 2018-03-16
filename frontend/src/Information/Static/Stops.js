import {runQuery} from "../HSLGraphQLDao";

let stops

export const getStops = async () => {
	if(stops) {
		return stops
	}

	let query = "{stops {id gtfsId name lat lon}}"

	stops = await runQuery(query)
	return stops.data.stops
}