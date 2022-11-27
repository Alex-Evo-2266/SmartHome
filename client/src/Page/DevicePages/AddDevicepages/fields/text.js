import React,{useCallback, useEffect, useState} from 'react'


export const FieldText = ({change, field}) => {


	return(
		<>
			<div className="configElement">
				<div className="input-data">
					<input onChange={change} required name="unit" type="text" value={field.unit}></input>
					<label>unit</label>
				</div>
			</div>
		</>
	  )
}
