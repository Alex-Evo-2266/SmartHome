import { GearIcon, Home, LogoutIcon, Plug, Room } from 'alex-evo-sh-ui-kit'
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { NavigationButton as NB } from 'alex-evo-sh-ui-kit'

export const useMainButtons = (): NB[] => {
  const { logout } = useHttp()
  return [
    { text: "home", type: "link", to: "/home", icon: <Home/> },
    { text: "device", type: "link", to: "/device", icon: <Plug/> },
    { text: "room", type: "link", to: "/room", icon: <Room/> },
    { text: "automation", type: "link", to: "/automation", icon: <Plug/> },
    { text: "settings", type: "link", to: "/settings", icon: <GearIcon/> },
    { text: "logout", type: "button", icon: <LogoutIcon/>, onClick: logout }
  ]
}
