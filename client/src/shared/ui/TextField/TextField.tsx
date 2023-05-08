import { XCircle } from "lucide-react"
import "./textField.scss"
import { useRef } from "react"

interface ITextFieldProps{
    onChange?:(event: React.ChangeEvent<HTMLInputElement>)=>void
    name?: string
    value?: number | string
    placeholder?: string
    validEmptyValue?: boolean
    className?: string
    onFocus?: (event:React.FocusEvent<HTMLInputElement>)=>void
    onBlur?: (event:React.FocusEvent<HTMLInputElement>)=>void
    error?: boolean
    icon?:React.ReactNode
    onClear?: ()=>void
}

export const TextField = ({onClear, icon, onChange, name, value, placeholder, className, validEmptyValue, onFocus, onBlur, error}:ITextFieldProps) => {

    const inputElement = useRef<HTMLInputElement>(null)

    const emptyValueClass = (validEmptyValue?:boolean, value?: string | number) => {
        if(error)
            return "error"
        if(validEmptyValue && (!value || value === ""))
            return "error"
        return ""	
    }

    const focus = () => {
        if(!inputElement.current)
            return
        inputElement.current.focus()
    }

    return(
        <div className={`text-field`}>
            {
                (icon)?
                <div className="icon-container" onClick={focus}>{icon}</div>:
                null
            }
            <div className="input-container" onClick={focus}>
                <input
                ref={inputElement}
                required 
                type="text" 
                className={`${className} ${emptyValueClass(validEmptyValue, value)}`} 
                name={name} 
                value={value} 
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}/>
                <label>{placeholder}</label>
            </div>
            <span className="text-field-line"></span>
            {
                (onClear)?
                <div className="clear-container"><XCircle onClick={onClear}/></div>:
                null
            }
		</div>
    )
}