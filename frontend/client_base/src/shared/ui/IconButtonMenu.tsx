import { MENU_ROOT_ID } from "../../const"
import {IBlock, IconButtonMenu as IconButtonM, useScreenSize} from 'alex-evo-sh-ui-kit'

export interface IconButtonProps{
    icon: React.ReactNode
    className?: string
    classNameContainer?: string
    disabled?: boolean
    style?: React.CSSProperties
    transparent?: boolean
    blocks: IBlock[]
  }

export const IconButtonMenu = (props:IconButtonProps) => {

	const {screen} = useScreenSize()

	return(<IconButtonM {...{...props}}
		container={document.getElementById(MENU_ROOT_ID)}
		screensize={screen}
		/>)
}

