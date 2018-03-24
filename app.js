let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose')
let https = require("https")
let fallback = require('express-history-api-fallback')

let index = require('./Routes/index');
let users = require('./Routes/users');
let routes = require("./Routes/routes")
let config = require('./Utils/Config')

let app = express();

const extractToken = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}

	next()
}

app.use(extractToken)

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise


app.use('/api/users', users);
app.use('/api/routes', routes)
process.env.PWD = process.cwd();
let root = path.join(process.env.PWD, 'frontend/build');
app.use(express.static(root));
app.use(fallback('index.html', {root}))


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.send('error');
// });



module.exports = app

