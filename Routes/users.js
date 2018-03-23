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
			return response.status(400).json({error: 'Password was too short'})
		}

		const existing = await User.findOne({username})
		if (existing) {
			return response.status(400).json({error: 'Username was taken'})
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
		response.status(500).json({error: 'Something went wrong...'})
	}
})

router.post('/exists', async (request, response) => {
	try{
		let {username} = request.body
		const exists = await User.findOne({username})
		response.status(200).json({exists: !!exists})
	} catch(e) {
		console.log(e)
		response.status(500).json({error: 'Something went wrong...'})
	}
})

module.exports = router;
