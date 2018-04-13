import * as navigation from './Navigation/NavigationActions'
import * as layout from './Information/Layout/LayoutActions'
import * as routes from './Routes/RoutesActions'
import * as users from './User/UserActions'
import * as situation from './Situation/SituationActions'

export default {...navigation, ...layout, ...routes, ...users, ...situation}