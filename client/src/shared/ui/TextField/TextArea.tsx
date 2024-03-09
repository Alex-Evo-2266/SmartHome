import { XCircle } from "lucide-react"
import "./TextArea.scss"
import { useCallback, useEffect, useRef, useState } from "react"

interface ITextAreaProps{
    onChange?:(event: React.ChangeEvent<HTMLTextAreaElement>)=>void
    name?: string
    value?: number | string
    placeholder?: string
    validEmptyValue?: boolean
    className?: string
    onFocus?: (event:React.FocusEvent<HTMLTextAreaElement>)=>void
    onBlur?: (event:React.FocusEvent<HTMLTextAreaElement>)=>void
    error?: boolean
    icon?:React.ReactNode
    onClear?: ()=>void
    border?: boolean
    readOnly?: boolean
    transparent?: boolean
}

export const TextArea = ({transparent, readOnly, border, onClear, icon, onChange, name, value, placeholder, className, validEmptyValue, onFocus, onBlur, error}:ITextAreaProps) => {

    const inputElement = useRef<HTMLTextAreaElement>(null)
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
        <div className={`text-area ${border?"border":""} ${transparent?"transparent":""} ${className}`}>
            {
                (icon)?
                <div className="icon-container" onClick={focus}>{icon}</div>:
                null
            }
            <div className="textarea-container" onClick={focus}>
                <textarea
                ref={inputElement}
                readOnly={readOnly}
                required 
                placeholder={placeholder}
                className={`${isError?"error":""}`} 
                name={name} 
                value={value} 
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}/>
            </div>
            {
                (onClear)?
                <div className="clear-container"><XCircle onClick={onClear}/></div>:
                null
            }
		</div>
    )
}