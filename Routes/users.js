let express = require('express');
let router = express.Router();
let User = require("../Models/User")
let bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post('/', async (request, response) => {
	try {
		const {username, password} = request.body

		if (password.length < 5) {
			return response.status(400).json({error: 'Password was too short', status: 400})
		}

		const existing = await User.findOne({username})
		if (existing) {
			return response.status(400).json({error: 'Username was taken', status: 400})
		}

		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = new User({
			username,
			passwordHash,
			language: "finnish",
			routes: []
		})

		const savedUser = User.format(await user.save())
		savedUser.token = jwt.sign(savedUser.username, process.env.SECRET)
		delete savedUser.passwordHash

		response.status(201).json(savedUser)
	} catch (exception) {
		console.log(exception)
		response.status(500).json({error: 'Something went wrong...', status: 500})
	}
})

router.post('/exists', async (request, response) => {
	try{
		let {username} = request.body
		const exists = await User.findOne({username})
		response.status(200).json({exists: !!exists})
	} catch(e) {
		console.log(e)
		response.status(500).json({error: 'Something went wrong...', status: 500})
	}
})

router.post("/login", async (request, response) => {
	try{
		if(request.token) {
			let token = request.token
			let username = jwt.verify(token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				response.status(200).json({...User.format(user), token})
			} else {
				response.status(400).json({error: "Bad token", status: 400})
			}
		} else {
			let {username, password} = request.body

			let user = await User.findOne({username})
			if(!user) {
				response.status(401).json({error: "Incorrect username or password", status: 401})
			}

			let passwordsMatch = await bcrypt.compare(password, user.passwordHash)
			if(passwordsMatch) {
				let token = jwt.sign(username, process.env.SECRET)
				response.status(200).json({...User.format(user), token})
			} else {
				response.status(401).json({error: "Incorrect username or password", status: 401})
			}
		}
	} catch(e) {
		console.log(e)
		response.status(500).json({error: 'Something went wrong...', status: 500})
	}
})

router.post("/language", async (request, response) => {
	try{
		if(request.token) {
			let username = jwt.verify(request.token, process.env.SECRET)
			let user = await User.findOne({username})
			if(user) {
				let language = request.body.language
				user.language = language
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

module.exports = router;
