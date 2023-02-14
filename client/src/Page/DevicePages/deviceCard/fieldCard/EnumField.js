import React,{useCallback,useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {useHttp} from '../../../../hooks/http.hook'

export const EnumField = ({field, value, systemName})=>{
	const [v, setV] = useState(false)
	const {request, error, clearError} = useHttp();
	const auth = useSelector(state=>state.auth)

    const getValues = (enum_values) => {
        let arr = enum_values.split(",")
        return arr.map(item=>item.trim())
    }

	useEffect(()=>{
		setV(value)
	},[value])

	const out = useCallback((e)=>{
		setV(e.target.value)
		request(`/api/devices/${systemName}/value/${field.name}/set/${e.target.value}`, "GET", null, {Authorization: `Bearer ${auth.token}`})
	},[request, systemName, field])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control input-data'>
                <select value={v} onChange={out}>
                {
                    getValues(field.enum_values).map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))
                }
                </select>
			</div>
		</div>
	)
}

