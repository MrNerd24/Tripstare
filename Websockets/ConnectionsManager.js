let server = require('../bin/www')
let io = require('socket.io')(server)
let socketManager = require('./SocketsManager')

let startListening = () => {
	io.on('connection', (socket) => {
		socketManager.addSocket(socket)
		socket.on('disconnect', () => {
			socketManager.removeSocket(socket)
		})
	})
}

module.exports = {io, startListening}