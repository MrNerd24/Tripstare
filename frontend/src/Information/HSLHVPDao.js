import Axios from 'axios'
import MQTT from 'async-mqtt'

let client = MQTT.connect("wss://mqtt.hsl.fi")

export const subscribe2 = async (listener, time = 1000, type = "+", id = "+", line = "+", direction = "+", headsign = "+", start_time = "+", next_stop = "+", geohash_level = "+", geohash = "+") => {
	type = type ? type : "+"
	id = id ? id : "+"
	line = line ? line : "+"
	direction = direction ? direction : "+"
	headsign = headsign ? headsign : "+"
	start_time = start_time ? start_time : "+"
	next_stop = next_stop ? next_stop : "+"
	geohash_level = geohash_level ? geohash_level : "+"
	geohash = geohash ? geohash : "+"
	let url = `/hfp/journey/${type}/${id}/${line}/${direction}/${headsign}/${start_time}/${next_stop}/${geohash_level}/${geohash}/#`
	console.log(url)
	console.log(client)
	client.subscribe(url)
	client.on("message", listener)
}



export const subscribe = async (listener, time = 1000, type = "+", id = "+", line = "+", direction = "+", headsign = "+", start_time = "+", next_stop = "+", geohash_level = "+", geohash = "+") => {
	type = type ? type : "+"
	id = id ? id : "+"
	line = line ? line : "+"
	direction = direction ? direction : "+"
	headsign = headsign ? headsign : "+"
	start_time = start_time ? start_time : "+"
	next_stop = next_stop ? next_stop : "+"
	geohash_level = geohash_level ? geohash_level : "+"
	geohash = geohash ? geohash : "+"
	let url = `http://api.digitransit.fi/realtime/vehicle-positions/v1/hfp/journey/${type}/${id}/${line}/${direction}/${headsign}/${start_time}/${next_stop}/${geohash_level}/${geohash}/`
	console.log(url)
	let unsubscribeID = setInterval(async () => {
		try{
			let response = await Axios.get(url)
			listener(response.data)
		} catch (e) {
			console.warn(e)
			console.warn(e.response)
		}
	}, 1000)

	return () => {
		clearInterval(unsubscribeID)
	}

}