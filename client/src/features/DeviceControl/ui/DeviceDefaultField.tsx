

interface FieldProps{
	value: string
    className?: string
}

export const DefaultFieldControl = ({value, className}:FieldProps)=>{

	return(
		<div className={`device-field ${className}`} >
			<div className='device-field-title'>
			{value}
			</div>
		</div>
	)
}

