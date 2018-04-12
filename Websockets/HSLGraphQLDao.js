let Axios = require('axios')

const runQuery = async (query) => {
	try{
		let config = {
			url: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
			method: "post",
			data: {query},
			headers: {
				'Content-Type': 'application/json'
			},
		}
		let response = await Axios(config)
		return response.data
	} catch (e) {
		console.warn(e)
		console.warn(e.response)
	}

}

module.exports = {runQuery}