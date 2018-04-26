import Store from '../../Store'
import Actions from '../../Actions'

let wid = null;
let shouldListen = false

export const startListeningLocation = () => {
	if(navigator.geolocation) {
		if(!wid) {
			watchPosition()
		}
	}
	shouldListen = true
}

export const stopListeningLocation = () => {
	if(navigator.geolocation) {
		if(wid) {
			navigator.geolocation.clearWatch(wid)
		}
		wid = null
	}
	shouldListen = false
}

let watchPosition = () => {
	wid = navigator.geolocation.watchPosition(newPosition, positionError, {timeout: 60000})
	navigator.geolocation.getCurrentPosition(newPosition, positionError, {timeout: 1000})
};
document.addEventListener("visibilitychange", () => {
	if(document.hidden) {
		if(navigator.geolocation) {
			if(wid) {
				navigator.geolocation.clearWatch(wid)
			}
			wid = null

		}
	} else {
		if(shouldListen) {
			if(navigator.geolocation) {
				if(!wid) {
					watchPosition();
				}
			}
		}
	}
})

const newPosition = (position) => {
	Store.dispatch(Actions.setLocationKnown(true))
	Store.dispatch(Actions.setLocation(position.coords.latitude, position.coords.longitude))
}

const positionError = (error) => {
	Store.dispatch(Actions.setLocationKnown(false))
}