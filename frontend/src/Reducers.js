import {combineReducers} from 'redux'
import navigation from './Navigation/NavigationReducer'
import information from './Information/InformationReducer'
import routes from './Routes/RoutesReducer'
import user from './User/UserReducer'
import situation from './Situation/SituationReducer'

export default combineReducers({
	navigation, information, routes, user, situation
})