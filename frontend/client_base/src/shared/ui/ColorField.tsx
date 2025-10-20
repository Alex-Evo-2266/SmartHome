import {ColorField as CF} from 'alex-evo-sh-ui-kit'

interface IColorFieldProps{
    onChange?:(value: string)=>void
    value?: string
    className?: string
    border?: boolean
    transparent?: boolean
    userColor?: string[]
    onAddColor?: (colors: string[])=>void
    placeholder?: string
    def?: string
}

export const ColorField = (props:IColorFieldProps) => {

    return(
        <CF {...{...props, container:document.getElementById('modal-root')}}/>
    )
}