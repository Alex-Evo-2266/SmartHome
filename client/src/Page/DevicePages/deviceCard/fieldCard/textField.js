

import React,{useCallback,useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {useHttp} from '../../../../hooks/http.hook'

export const TextField = ({field, value, systemName})=>{
	const [v, setV] = useState("")
	const {request, error, clearError} = useHttp();
	const auth = useSelector(state=>state.auth)

	useEffect(()=>{
		setV(value)
	},[value])

	const out = useCallback(()=>{
		request(`/api/devices/${systemName}/value/${field.name}/set/${v}`, "GET", null, {Authorization: `Bearer ${auth.token}`})
	},[request, systemName, field, v])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control input-data'>
				<input type="text" value={v} onChange={(e)=>setV(e.target.value)}/>
				<button style={{maxWidth: "100px"}} className='btn' onClick={out}>send</button>
			</div>
		</div>
	)
}

