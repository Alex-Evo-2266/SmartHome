import {TimeField as TF} from 'alex-evo-sh-ui-kit'

import { MODAL_ROOT_ID } from '../../const'

interface ITimeFieldProps{
    onChange?:(value: string)=>void
    name?: string
    value?: string
    validEmptyValue?: boolean
    className?: string
    error?: boolean
    border?: boolean
}

export const TimeField = (props:ITimeFieldProps) => {

    return(
        <TF {...{...props, container:document.getElementById(MODAL_ROOT_ID)}}/>
    )
}