import LocalForage from 'localforage'

export const getRoutes = async () => {
	let routes = await LocalForage.getItem("routes");
	if(routes) {
		return routes
	} else {
		LocalForage.setItem("routes", [])
		return []
	}

}

export const getRoute = async (id) => {
	let routes = await getRoutes()
	return routes.find((route) => route.id === id)
}

const generateRouteId = (routes) => {
	while(true) {
		let found = false
		let id = [...Array(20)].map(() => Math.random().toString(36).slice(-1)).join("")
		for(let i = 0; i < routes.length; i++) {
			if(routes[i].id === id) {
				found = true
				break;
			}
		}

		if(!found) {
			return id
		}
	}

}


export const addRoute = async (route) => {
	let routes = await getRoutes()
	route.id = generateRouteId(routes)
	routes.push(route)
	LocalForage.setItem('routes', routes)
	return route
}

export const setRoute = async (route) => {
	let routes = await getRoutes()
	LocalForage.setItem("routes", routes.map((routesItem) => routesItem.id === route.id ? route : routesItem))

}

export const deleteRoute = async (route) => {
	let routes = await getRoutes()
	LocalForage.setItem("routes", routes.filter((routesItem) => route.id !== routesItem.id))
}

export default {getRoute, getRoutes, addRoute, setRoute, deleteRoute}