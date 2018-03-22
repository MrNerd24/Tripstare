import {runQuery} from "../HSLGraphQLDao";

let stops

export const getStops = async () => {
	if(stops) {
		return stops
	}

	let query = "{stops {id gtfsId name desc code platformCode lat lon}}"

	let result = await runQuery(query)
	stops = result.data.stops
	return stops
}