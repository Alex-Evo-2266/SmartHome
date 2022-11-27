import React,{useCallback, useEffect, useState} from 'react'



export const FieldBinary = ({change, field}) => {


	return(
		<>
			<div className="configElement">
				<div className="input-data">
					<input onChange={change} required name="low" type="text" value={field.low}></input>
					<label>low</label>
				</div>
			</div>
			<div className="configElement">
				<div className="input-data">
					<input onChange={change} required name="high" type="text" value={field.high}></input>
					<label>high</label>
				</div>
			</div>
		</>
	  )
}
