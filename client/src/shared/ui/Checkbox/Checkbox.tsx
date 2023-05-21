import { Check } from "lucide-react"
import "./Checkbox.scss"

interface CheckboxProps{
    name?: string
    checked?: boolean
    readOnly?: boolean
    onChange?: (e?: React.ChangeEvent<HTMLInputElement>)=>void
}

export const Checkbox = ({name, checked, onChange, readOnly}:CheckboxProps) => {
    return(
        <label className="checkbox-container">
            <input className="checkbox" name={name} type="checkbox" checked={checked} onChange={onChange} readOnly={readOnly}/>
            <span><Check/></span>
        </label>
    )
}