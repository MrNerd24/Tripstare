import Store from '../../Store'
import Actions from '../../Actions'

export const initListeners = () => {
	listenToScreenSize()
}

export const listenToScreenSize = () => {
	window.addEventListener("resize", () => Store.dispatch(Actions.setScreenSize(window.innerWidth, window.innerHeight)))
	Store.dispatch(Actions.setScreenSize(window.innerWidth, window.innerHeight))
}