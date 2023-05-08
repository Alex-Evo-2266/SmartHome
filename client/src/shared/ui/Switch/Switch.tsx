import "./Switch.scss"

interface ISwitchProps{
    name?: string
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void
    checked?: boolean,
    className?: string
}

export const Switch = ({name, onChange, checked, className}:ISwitchProps) => {

    return(
        <div className={`swich-container ${className}`}>
            <input type="checkbox" name={name} onChange={onChange} checked={checked}/>
        </div>
    )
}