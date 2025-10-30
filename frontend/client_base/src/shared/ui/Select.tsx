import { IOption, SelectField as SF, useScreenSize } from "alex-evo-sh-ui-kit"

import { MENU_ROOT_ID } from "../../const"

interface ISelectFieldProps{
    onChange?:(value: string)=>void
    value?: string
    placeholder?: string
    className?: string
    items: (IOption | string)[]
    border?: boolean
    name?: string
    error?: boolean
    onFocus?: (e:React.FocusEvent<HTMLInputElement>)=>void
    onBlur?: (e:React.FocusEvent<HTMLInputElement>)=>void
}

export const SelectField = (props:ISelectFieldProps) => {

    const {screen} = useScreenSize()

    return(<SF {...{...props, screensize: screen, container: document.getElementById(MENU_ROOT_ID)}} />)
}