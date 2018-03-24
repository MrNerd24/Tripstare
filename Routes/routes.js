let express = require('express');
let router = express.Router();
let User = require("../Models/User")
let bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async (request, response, next) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				response.status(200).json(user.routes)
			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			response.status(400).json({error: "Token missing", status: 400})
		}
	}catch(e) {
		console.log(e)
		response.status(500).json({error: "Something went wrong...", status:500})
	}

});

router.get('/:id', async (request, response, next) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				let id = request.params.id
				let route = user.routes.find((route) => route.id === id)
				if(route) {
					response.status(200).json(route)
				} else {
					response.status(404).json({error: "Route not found.", status:404})
				}

			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			response.status(400).json({error: "Token missing", status: 400})
		}
	}catch(e) {
		console.log(e)
		response.status(500).json({error: "Something went wrong...", status:500})
	}

});

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

router.post('/', async (request, response, next) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				let route = request.body
				route.id = generateRouteId(user.routes)
				console.log(route.id)
				user.routes.push(route)
				user.save()
				response.status(201).json(route)
			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			response.status(400).json({error: "Token missing", status: 400})
		}
	} catch (e) {
		console.log(e)
		response.status(500).json({error: "Something went wrong...", status:500})
	}
})

router.put('/', async (request, response, next) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				let editedroute = request.body
				user.routes = user.routes.map((route) => route.id === editedroute.id ? editedroute : route)
				user.save()
				response.status(201).json(editedroute)
			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			response.status(400).json({error: "Token missing", status: 400})
		}
	} catch (e) {
		console.log(e)
		response.status(500).json({error: "Something went wrong...", status:500})
	}
})

router.delete('/:id', async (request, response, next) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				let id = request.params.id
				user.routes = user.routes.filter((route) => route.id !== id)
				user.save()
				response.status(204).send()
			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			response.status(400).json({error: "Token missing", status: 400})
		}
	} catch (e) {
		console.log(e)
		response.status(500).json({error: "Something went wrong...", status:500})
	}
})

module.exports = router