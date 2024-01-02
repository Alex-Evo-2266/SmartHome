import { XCircle } from "lucide-react"
import "./textField.scss"
import { useCallback, useEffect, useRef, useState } from "react"

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
    border?: boolean
    password?: boolean
    readOnly?: boolean
    type?:string
    transparent?: boolean
    min?: number
    max?: number
}

export const TextField = ({type = "text", transparent, readOnly, password, border, onClear, icon, onChange, name, value, placeholder, className, validEmptyValue, onFocus, onBlur, error, max, min}:ITextFieldProps) => {

    const inputElement = useRef<HTMLInputElement>(null)
    const [isError, setError] = useState<boolean>(false)

    const emptyValueClass = useCallback((validEmptyValue?:boolean, value?: string | number) => {
        if(error)
            return setError(true)
        if(validEmptyValue && (!value || value === ""))
            return setError(true)
        return setError(false)
    },[])

    useEffect(()=>{
        emptyValueClass(validEmptyValue, value)
    },[value, validEmptyValue, emptyValueClass])

    const focus = () => {
        if(!inputElement.current)
            return
        inputElement.current.focus()
    }

    return(
        <div className={`text-field ${border?"border":""} ${transparent?"transparent":""} ${className}`}>
            {
                (icon)?
                <div className="icon-container" onClick={focus}>{icon}</div>:
                null
            }
            <div className="input-container" onClick={focus}>
                <input
                ref={inputElement}
                max={max}
                min={min}
                readOnly={readOnly}
                required 
                type={password?"password":type} 
                className={`${isError?"error":""}`} 
                name={name} 
                value={value} 
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}/>
                <label>{placeholder}</label>
                <span className="text-field-line"></span>
            </div>
            {
                (onClear)?
                <div className="clear-container"><XCircle onClick={onClear}/></div>:
                null
            }
		</div>
    )
}