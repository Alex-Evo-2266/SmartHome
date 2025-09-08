import { NavigationBar, NavigationBtn, NavigationButton, NavigationDrawer, NavigationRail, ScreenSize, useScreenSize, X } from 'alex-evo-sh-ui-kit'
import { useState } from "react"
import { joinBarButtons } from '../config/barButtons'
import { NavigatePortal } from '@src/shared/ui/NavigatePortal'

export const Navigation = (
	{mainBtn, otherBtn, barBtn:bt, first_btn}:{mainBtn:NavigationButton[], otherBtn:NavigationButton[], barBtn: NavigationButton[], first_btn?: NavigationBtn}
) => {
  const { screen } = useScreenSize()

  const [visible, setVisible] = useState(false)
  const barBtn = joinBarButtons(setVisible, [...(first_btn?[first_btn]:[]), ...bt])

  const closeBtn:NavigationButton = {
            type: "button",
            text: "colse",
            onClick: ()=>setVisible(false),
            icon: <X/>
          }

  if (screen === ScreenSize.MOBILE)
    return (
      <NavigatePortal>
        <NavigationDrawer 
          onHide={()=>setVisible(false)}
          openAlways={false}
          visible={visible} 
          mainBtn={[closeBtn, ...mainBtn]} 
          otherBtn={otherBtn}
		      firstBtn={first_btn}
        />
        <NavigationBar btns={barBtn} />
      </NavigatePortal>
    )

  if (screen === ScreenSize.STANDART)
    return (
      <NavigatePortal>
        <NavigationDrawer 
          onHide={()=>setVisible(false)}
          openAlways={false}
          visible={visible} 
          mainBtn={[closeBtn, ...mainBtn]} 
          otherBtn={otherBtn}
		      firstBtn={first_btn}
        />
        <NavigationRail 
          onToggleMenu={()=>setVisible(prev=>!prev)} 
          mainBtn={mainBtn}
		      firstBtn={first_btn}
        />
      </NavigatePortal>
    )

  return (
    <NavigatePortal>
      <NavigationDrawer 
        onHide={()=>setVisible(false)}
        openAlways={true}
        visible={visible} 
        mainBtn={mainBtn} 
        otherBtn={otherBtn}
		    firstBtn={first_btn}
      />
    </NavigatePortal>
  )
}
