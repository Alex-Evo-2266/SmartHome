import { useCallback, useEffect, useState } from 'react'
import { useServerSettingsApi } from '../api/settings'
import './ServerSettings.scss'
import { Card, Divider, TextField } from "alex-evo-sh-ui-kit"
import { ConfigData } from '../models/serverConfig'
import { mapServerSettingsToDict, mapServerSettingsToList } from '../lib/helpers/mapServerSetting'
import { ServerSettingsButtons } from './ServerSettingsButton'

interface ServerSettingsProps{
	className?: string
}

export const ServerSettings = ({className}:ServerSettingsProps) => {

	const {getServerSettings, setServerSettings} = useServerSettingsApi()
	const [settings, setSettings] = useState<ConfigData[]>([])

	const getSettings = useCallback(async() => {
		let data = await getServerSettings()
		setSettings(mapServerSettingsToList(data.moduleConfig))
	},[getServerSettings])

	const changeHandler = useCallback((nameModule:string, nameField: string, event: React.ChangeEvent<HTMLInputElement>) => {
		let arr = settings.slice()
		for (var item of arr) {
			if(item.name === nameModule) {
				for (var item2 of item.content) {
					if(item2.name === nameField) {
						item2.value = event.target.value
						setSettings(arr)
						return
					}
				}
				return
		  	}
		}
	},[settings])

	const save = useCallback(async() => {
		await setServerSettings(mapServerSettingsToDict(settings))
	},[settings])

	useEffect(()=>{
		getSettings()
	},[getSettings])

	useEffect(()=>{
		console.log(settings)
	},[settings])

	return(
		<Card className={`settings-card ${className ?? ""}`} header='Server settings' action={<ServerSettingsButtons onSave={save}/>}>
			<div className='server-settings-container'>
			{
				settings.map((item, index)=>(
					<div key={index} className='settings-block'>
						{(index !== 0)? <Divider/>: null}
						<div className='settings-block-header'>{item.name}</div>
						<div className='settings-block-content'>
						{
							item.content.map((item2, index2)=>(
								<div className='settings-field' key={index2}>
									<TextField placeholder={item2.name} border value={item2.value} onChange={(e)=>changeHandler(item.name, item2.name, e)}/>
								</div>
							))
						}
						</div>

					</div>
				))
			}
			</div>
		</Card>
	)
}