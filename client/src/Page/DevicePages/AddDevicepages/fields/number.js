import React,{useCallback, useEffect, useState} from 'react'

const defOptions = {
	low:true,
	high:true,
	unit:true,
}

export const FieldNumber = ({change, field, options=defOptions}) => {


  return(
	<>
	{
		(options.low)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="low" type="number" value={Number(field.low)}></input>
				<label>low</label>
			</div>
		</div>:null
	}
	{
		(options.high)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="high" type="number" value={Number(field.high)}></input>
				<label>high</label>
			</div>
		</div>:null
	}
	{
		(options.unit)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="unit" type="text" value={field.unit}></input>
				<label>unit</label>
			</div>
		</div>:null
	}
	</>
  )
}
