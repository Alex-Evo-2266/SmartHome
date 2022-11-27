import React,{useCallback, useEffect, useState} from 'react'
import { MiniCard } from '../../../components/cards/miniCard'
import { useDispatch } from 'react-redux'
import { hideDialog, showConfirmationDialog } from '../../../store/reducers/dialogReducer'

export const FieldDevicePage = ({options, setDevice, device, next, prev}) => {

	const dispatch = useDispatch()

	const changeHandler = (e)=>{

	}

  return(
	<div className='pagecontent'>
		<h2>Field</h2>
		<div className="configElement">
      		<div className="input-data">
				<select name="value_type" value={device.value_type} onChange={changeHandler}>
					<option value="json">json</option>
					<option value="value">value</option>
				</select>
        		<label>Name</label>
      		</div>
    	</div>
	</div>
  )
}
