import './DeviceAddDialog.scss'
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { Card, FullScrinTemplateDialog } from "../../../shared/ui"
import { ListContainer } from '../../../shared/ui/List/List'
import { ListItem } from '../../../shared/ui/List/ListItem'



export const DeviceAddDialog = () => {

	const {deviceOption} = useAppSelector(state=>state.deviceOptions)
	const dispatch = useAppDispatch()

	const hide = () => {
		dispatch(hideFullScreenDialog())
	}

	const save = useCallback(() => {
		
	},[])

	useEffect(()=>{
		console.log(deviceOption[0])
	},[deviceOption])

	return(
		<FullScrinTemplateDialog onHide={hide} header={`Add device`} onSave={save}>
			<div className="device-add-container">
				<Card header='s'></Card>
			</div>
			<ListContainer transparent>
				{
					deviceOption.map((item, index)=>(
						<ListItem hovered key={index} header={item.class_name}/>
					))
				}
			</ListContainer>
		</FullScrinTemplateDialog>
	)
}