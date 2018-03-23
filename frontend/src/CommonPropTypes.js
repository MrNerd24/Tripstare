import PropTypes from 'prop-types'

export const stop = PropTypes.shape({
	gtfsId: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	platformCode: PropTypes.string,
	desc: PropTypes.string.isRequired,
	code: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	value: PropTypes.string
})

export const stops = PropTypes.arrayOf(stop)

export const route = PropTypes.shape({
	startStop: stop,
	endStop: stop,
	id: PropTypes.string.isRequired
})

export const routes = PropTypes.arrayOf(route)