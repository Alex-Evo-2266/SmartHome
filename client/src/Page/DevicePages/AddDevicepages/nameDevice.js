import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { HidingDiv } from '../../../components/hidingDiv'
import { Loader } from '../../../components/Loader'
import { FieldComponent } from './fields/fieldComponent'

export const NameDevicePage = ({options, setDevice, device, next, prev}) => {

	const changeHandler = (e)=>{
		setDevice(prev=>({...prev, [e.target.name]:e.target.value}))
	}

  return(
	<div className='pagecontent card-container'>
		<h2>Name Device</h2>
		<div className="configElement">
			<div className="input-data">
				<input onChange={changeHandler} required name="name" type="text" value={device.name}></input>
				<label>name</label>
			</div>
		</div>
		<div className="configElement">
			<div className="input-data">
				<input onChange={changeHandler} required name="system_name" type="text" value={device.system_name}></input>
				<label>system name</label>
			</div>
		</div>
		{
		(options.address)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={changeHandler} required name="address" type="text" value={device.address}></input>
				<label>address</label>
			</div>
		</div>:
		null
		}
		{
		(options.token)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={changeHandler} required name="token" type="text" value={device.token}></input>
				<label>token</label>
			</div>
		</div>:
		null
		}
		<div className="card-btn-container">
			<button className='btn' onClick={prev}>back</button>
			<button className='btn' onClick={next}>next</button>
		</div>
	</div>
  )
}
