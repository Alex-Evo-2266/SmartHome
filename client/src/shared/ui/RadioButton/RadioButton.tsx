import "./RadioButton.scss"

interface RadioButtonProps{
    name: string
    currentValue?: string | number
    value?: string | number
    onChange?: (e:React.ChangeEvent<HTMLInputElement>)=>void
    readOnly?: boolean
    checked?: boolean
}

interface BaseRadioButtonProps{
    name: string
    checked?: boolean
}

export const BaseRadioButton = ({name, checked}:BaseRadioButtonProps) => {

    return(
        <label className="radio-button-container">
            <input className="radio-button" name={name} type="radio" checked={checked} readOnly/>
            <span></span>
        </label>
    )
}

export const RadioButton = ({name, currentValue, value, onChange, readOnly, checked}:RadioButtonProps) => {

    return(
        <label className="radio-button-container">
            <input className="radio-button" name={name} type="radio" checked={currentValue === value || checked} value={value} onChange={onChange} readOnly={readOnly}/>
            <span></span>
        </label>
    )
}