import { MenuIcon, Home, NavigationButton as NB, Plug, ToolsIcon } from 'alex-evo-sh-ui-kit'
import { Dispatch, SetStateAction } from 'react'

export const getBarButtons = (): NB[] => [
  {
    text: "home",
    type:"link",
    to: "/home",
    icon: <Home/>
  },
  { text: "device", type: "link", to: "/device", icon: <Plug/> }
]

export const getBarButtonsHomePage = (): NB[] => [
  { text: "device", type: "link", to: "/device", icon: <Plug/> }
]


export const joinBarButtons = (setVisible: Dispatch<SetStateAction<boolean>>, btns: NB[]): NB[] => [
  {
    text: "menu",
    type: "button",
    onClick: ()=>setVisible(prev=>!prev),
    icon: <MenuIcon/>
  },
  ...btns
]
