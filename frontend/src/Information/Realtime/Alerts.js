import {runQuery} from "../HSLGraphQLDao";

let alertsCache = null
let alertsUpdatedTime = 0

export const getAlerts = async (route, stop, language) => {
	let query = `{
  alerts{
  	id
    stop {
      gtfsId
    }
    route{
      gtfsId
    }
    alertHeaderTextTranslations{
      text
      language
    }
    alertDescriptionTextTranslations{
      text
      language
    }
  }
}`
	let alerts = null
	if (alertsCache && Date.now() - alertsUpdatedTime < 600000) {
		alerts = alertsCache
	} else {
		let response = await runQuery(query)
		alerts = response.data.alerts
		alertsCache = alerts
		alertsUpdatedTime = Date.now()
	}
	if (!route && !stop) {
		alerts = alerts.map((alert) => {
			return {
				id: alert.id,
				description: alert.alertDescriptionTextTranslations.find((desc) => desc.language === language).text,
				header: alert.alertHeaderTextTranslations.find((desc) => desc.language === language).text
			}
		})
	} else {
		alerts = alerts.filter((alert) => {
			return (alert.stop && alert.stop.gtfsId === stop) || (alert.route && alert.route.gtfsId === route)
		})
		alerts = alerts.map((alert) => {
			let description = alert.alertDescriptionTextTranslations.find((desc) => desc.language === language);
			let header = alert.alertHeaderTextTranslations.find((desc) => desc.language === language);
			return {
				id: alert.id,
				description: description ? description.text : null,
				header: header ? header.text : null
			}
		})
	}


	return alerts
}