import {runQuery} from "../HSLGraphQLDao";

export const routesBetweenStops = async (startId, endId) => {

	let query = `{
  stop(id :"${startId}") {
    routes{
      gtfsId
      stops{
        gtfsId
      }
    }
  }
}`
	let result = await runQuery(query)
	let connectedRoutesIds = []
	let routes = result.data.stop.routes
	for(let i = 0; i < routes.length; i++) {
		let gtfsId = routes[i].gtfsId
		let found = false
		for(let j = 0; j < routes[i].stops.length; j++) {
			if(routes[i].stops[j].gtfsId === endId) {
				found=true
				break
			}
		}
		if(found) {
			connectedRoutesIds.push(gtfsId)
		}
	}
	return connectedRoutesIds
}

export const getRoute = async (routeId) => {

	let query = `{
  route(id: "${routeId}") {
    shortName
    longName
    gtfsId
    mode
		bikesAllowed
    alerts {
      alertDescriptionTextTranslations {
        text
        language
      }
    }
  }
}`
	let response = await runQuery(query)
	return response.data.route

}