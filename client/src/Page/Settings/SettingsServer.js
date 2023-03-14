import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';

const dictToList = (dict)=>{
	if (typeof(dict) !== "object")
		return []
	let arr = []
	for (const key in dict) {
		arr.push({name: key, value: dict[key]})
	}
	return arr
}

const dictToList2 = (dict)=>{
	if (typeof(dict) !== "object")
		return []
	let arr = []
	for (const key in dict) {
		arr.push({name: key, value: dictToList(dict[key])})
	}
	return arr
}

const ListToDict = (list)=>{
	if (!Array.isArray(list))
		return {}
	let dict = {}
	for (const item of list) {
		dict[item.name] = item.value
	}
	return dict
}

const ListToDict2 = (list)=>{
	if (!Array.isArray(list))
		return {}
	let dict = {}
	for (const item of list) {
		dict[item.name] = ListToDict(item.value)
	}
	return dict
}

export const SettingsServerPage = () => {
	const auth = useSelector(state=>state.auth)
	const {message} = useMessage();
	const {request, error, clearError} = useHttp();
	const [config, setConfig] = useState([])

	const getConfig = useCallback(async()=>{
		try{
			let data = await request("/api/server/config", "GET", null, {Authorization: `Bearer ${auth.token}`})
			console.log(data)
    		setConfig(dictToList2(data.moduleConfig))
		}
		catch(e){
			console.error(e)
		}
	},[request, auth.token])

	const save = async ()=>{
		try{
			await request("/api/server/config", "PUT", {moduleConfig: ListToDict2(config)}, {Authorization: `Bearer ${auth.token}`})
			message("config update", "success")
		}catch{}
	}

	const changeHandler = (event, module, field) => {
		let arr = config.slice()
		for (var item of arr) {
		  if(item.name === module)
		  {
			for (var item2 of item.value) {
			  if(item2.name === field)
			  {
				item2.value = event.target.value
				setConfig(arr)
				return
			  }
			}
			return
		  }
		}
	}

	useEffect(()=>{
    	message(error,"error")
    	return ()=>{
      		clearError();
    	}
  	},[error,message, clearError])

	useEffect(()=>{
		getConfig()
	},[getConfig])

	useEffect(()=>{
		console.log(config)
	},[config])

	return (
		<div className = "container pagecontent normal-color">
		{
			config.map((item, index)=>(
				<div key={index}>
					<div className="configTitle">
						<p className="text">{item.name}</p>
					</div>
					{
						item?.value?.map((item2, index2)=>{
							return(
								<div key={index2} className="configElement">
									<div className="input-data">
										<input onChange={(e)=>changeHandler(e, item.name, item2.name)} required name={item2.name} type="text" value={item2.value} disabled = {(!item2)}></input>
										<label>{item2.name}</label>
									</div>
								</div>
							)
						})
					}
				<div className="dividers"></div>
				</div>
			))
		}
			<div>
				<button className='btn' onClick={save}>save</button>
			</div>
		</div>
	)
}
