const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: String,
	passwordHash: String,
	routes: [mongoose.Schema.Types.Mixed],
	language: String,
})

userSchema.statics.format = (user) => {
	return {
		id: user._id,
		username: user.username,
		routes: user.routes,
		language: user.language,
	}
}

const User = mongoose.model('User', userSchema)
module.exports = User