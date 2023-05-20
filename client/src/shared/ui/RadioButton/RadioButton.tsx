import "./RadioButton.scss"

interface RadioButtonProps{
    name: string
    currentValue?: string | number
    value?: string | number
    onChange?: (e:React.ChangeEvent<HTMLInputElement>)=>void
    readOnly?: boolean
}

export const RadioButton = ({name, currentValue, value, onChange, readOnly}:RadioButtonProps) => {

    return(
        <label className="radio-button-container">
            <input className="radio-button" name={name} type="radio" checked={currentValue === value} value={value} onChange={onChange} readOnly={readOnly}/>
            <span></span>
        </label>
    )
}