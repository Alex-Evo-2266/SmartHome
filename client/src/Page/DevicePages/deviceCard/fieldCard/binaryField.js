


import React,{useCallback,useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {useHttp} from '../../../../hooks/http.hook'

export const BinaryField = ({field, value, systemName})=>{
	const [v, setV] = useState(false)
	const read = useRef(true)
	const {request, error, clearError} = useHttp();
	const auth = useSelector(state=>state.auth)

	useEffect(()=>{
		if(read.current)
		{
			if(field.hight === value)
				setV(true)
			else
				setV(false)
		}
		read.current = false
	},[value])

	const out = useCallback((e)=>{
		let newV = field.low
		if(e.target.checked)
			newV = field.high
		setV(e.target.checked)
		request(`/api/devices/${systemName}/set_value/${field.name}/set/${(newV)}`, "GET", null, {Authorization: `Bearer ${auth.token}`})
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

