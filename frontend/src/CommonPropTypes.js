import PropTypes from 'prop-types'

export const Stop = PropTypes.shape({
	gtfsId: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	platformCode: PropTypes.string,
	desc: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	value: PropTypes.string
})

export const Stops = PropTypes.arrayOf(Stop)

export const Route = PropTypes.shape({
	startStop: Stop,
	endStop: Stop,
	id: PropTypes.string.isRequired
})

export const routes = PropTypes.arrayOf(Route)