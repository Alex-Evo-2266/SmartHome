import React,{useCallback, useEffect, useState} from 'react'



export const FieldEnum = ({change, field}) => {


	return(
		<>
			<div className="configElement">
				<div className="input-data">
					<input onChange={change} required name="enum_values" type="text" value={field.enum_values}></input>
					<label>enum_values</label>
				</div>
			</div>
		</>
	  )
}
