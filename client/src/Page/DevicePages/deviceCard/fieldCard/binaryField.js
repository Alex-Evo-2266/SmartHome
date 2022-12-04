


import React,{useCallback,useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {useHttp} from '../../../../hooks/http.hook'

export const BinaryField = ({field, value, systemName})=>{
	const [v, setV] = useState(false)
	const {request, error, clearError} = useHttp();
	const auth = useSelector(state=>state.auth)

	useEffect(()=>{
		if(field.high === String(value))
			setV(true)
		else
			setV(false)
	},[value])

	const out = useCallback((e)=>{
		let newV = field.low
		if(e.target.checked)
			newV = field.high
		setV(e.target.checked)
		request(`/api/devices/${systemName}/value/${field.name}/set/${(newV)}`, "GET", null, {Authorization: `Bearer ${auth.token}`})
	},[request, systemName, field])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control'>
				<label className="switch">
          			<input onChange={out} name="auteStyle" type="checkbox" checked={v}></input>
          			<span></span>
          			<i className="indicator"></i>
        		</label>
			</div>
		</div>
	)
}

