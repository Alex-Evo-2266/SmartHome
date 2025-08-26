import { NavigationBar, NavigationBtn, NavigationButton, NavigationDrawer, NavigationRail, ScreenSize, useScreenSize } from 'alex-evo-sh-ui-kit'
import { useState } from "react"
import { joinBarButtons } from '../config/barButtons'

export const Navigation = (
	{mainBtn, otherBtn, barBtn:bt, first_btn}:{mainBtn:NavigationButton[], otherBtn:NavigationButton[], barBtn: NavigationButton[], first_btn?: NavigationBtn}
) => {
  const { screen } = useScreenSize()

  const [visible, setVisible] = useState(false)
  const barBtn = joinBarButtons(setVisible, [...(first_btn?[first_btn]:[]), ...bt])

  if (screen === ScreenSize.MOBILE)
    return (
      <>
        <NavigationDrawer 
          onHide={()=>setVisible(false)}
          openAlways={false}
          visible={visible} 
          mainBtn={mainBtn} 
          otherBtn={otherBtn}
		  firstBtn={first_btn}
        />
        <NavigationBar btns={barBtn} />
      </>
    )

  if (screen === ScreenSize.STANDART)
    return (
      <>
        <NavigationDrawer 
          onHide={()=>setVisible(false)}
          openAlways={false}
          visible={visible} 
          mainBtn={mainBtn} 
          otherBtn={otherBtn}
		  firstBtn={first_btn}
        />
        <NavigationRail 
          onToggleMenu={()=>setVisible(prev=>!prev)} 
          mainBtn={mainBtn}
		  firstBtn={first_btn}
        />
      </>
    )

  return (
    <>
      <NavigationDrawer 
        onHide={()=>setVisible(false)}
        openAlways={true}
        visible={visible} 
        mainBtn={mainBtn} 
        otherBtn={otherBtn}
		firstBtn={first_btn}
      />
    </>
  )
}
