import { IOption, SelectField as SF, useScreenSize } from "alex-evo-sh-ui-kit"

import { MENU_ROOT_ID } from "../../const"
import { ISelectFieldPropsForm } from "alex-evo-sh-ui-kit/dist/lib/ui/input/Form/inputs/formSelectInput"

type Style = ISelectFieldPropsForm['style']
type Size = ISelectFieldPropsForm['size']

interface ISelectFieldProps{
    onChange?:(value: string)=>void
    value?: string
    placeholder?: string
    className?: string
    items: (IOption | string)[]
    border?: boolean
    name?: string
    disabled?: boolean;
    error?: boolean
    style?: Style
    size?: Size
    onFocus?: (e:React.FocusEvent<HTMLInputElement>)=>void
    onBlur?: (e:React.FocusEvent<HTMLInputElement>)=>void
}

export const SelectField = (props:ISelectFieldProps) => {

    const {screen} = useScreenSize()

    return(<SF {...{...props, screensize: screen, container: document.getElementById(MENU_ROOT_ID)}} />)
}