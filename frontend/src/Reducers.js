import {combineReducers} from 'redux'
import navigation from './Navigation/NavigationReducer'
import information from './Information/InformationReducer'
import routes from './Routes/RoutesReducer'

export default combineReducers({
	navigation, information, routes
})