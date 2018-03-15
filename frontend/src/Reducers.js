import {combineReducers} from 'redux'
import navigation from './Navigation/NavigationReducer'
import information from './Information/InformationReducer'

export default combineReducers({
	navigation, information
})