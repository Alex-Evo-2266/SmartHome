import "./textField.scss"

interface textFieldProps{
    onChange?:(event: React.ChangeEvent<HTMLInputElement>)=>void
    name?: string
    value?: number | string
    placeholder?: string
    validEmptyValue?: boolean
    className?: string
    onFocus?: (event:React.FocusEvent<HTMLInputElement>)=>void
    onBlur?: (event:React.FocusEvent<HTMLInputElement>)=>void
}

export const TextField:React.FC<textFieldProps> = ({onChange, name, value, placeholder, className, validEmptyValue, onFocus, onBlur}) => {

    const emptyValueClass = (validEmptyValue?:boolean, value?: string | number) => {
        if(validEmptyValue && (!value || value === ""))
            return "error"
        return ""
    }

    return(
        <div className="text-field">
			<input 
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
    )
}