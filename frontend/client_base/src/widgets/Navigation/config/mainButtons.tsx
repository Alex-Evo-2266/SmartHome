import { Dashboard, GearIcon, Home, LogoutIcon, Plug, Room } from 'alex-evo-sh-ui-kit'
import { NavigationButton as NB } from 'alex-evo-sh-ui-kit'

import { useAuth } from 'alex-evo-sh-auth'

export const useMainButtons = (): NB[] => {
  const { logout } = useAuth()
  return [
    { text: "home", type: "link", to: "/home", icon: <Home/> },
    { text: "device", type: "link", to: "/device", icon: <Plug/> },
    { text: "room", type: "link", to: "/room", icon: <Room/> },
    { text: "automation", type: "link", to: "/automation", icon: <Plug/> },
    { text: "settings", type: "link", to: "/settings", icon: <GearIcon/> },
    { text: "dashboards", type: "link", to: "/dashboard", icon: <Dashboard/>},
    { text: "logout", type: "button", icon: <LogoutIcon/>, onClick: logout }
  ]
}
