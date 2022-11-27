import React,{useCallback, useEffect, useState} from 'react'



export const FieldNumber = ({change, field}) => {


  return(
	<>
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="low" type="number" value={Number(field.low)}></input>
				<label>low</label>
			</div>
		</div>
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="high" type="number" value={Number(field.high)}></input>
				<label>high</label>
			</div>
		</div>
		<div className="configElement">
			<div className="input-data">
				<input onChange={change} required name="unit" type="text" value={field.unit}></input>
				<label>unit</label>
			</div>
		</div>
	</>
  )
}
