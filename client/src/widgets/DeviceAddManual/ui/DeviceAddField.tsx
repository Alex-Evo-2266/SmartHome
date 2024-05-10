import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseDialog, Button, Divider, FilledButton, FullScrinTemplateDialog, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { Trash2 } from 'lucide-react'
import { DeviceFieldType, FieldDevice } from '../../../entites/Device/models/deviceData'
import { DeviceOption } from '../../../features/DeviceOption'
import { DeviceAddField } from './DeviceAddFieldDialog'

interface DeviceAddFieldDialogProps{
	option: DeviceOption 
    fields: FieldDevice[]
    onNext:(fields: FieldDevice[])=>void
    onPrev:()=>void
}

export const DeviceAddFieldDialog = (props:DeviceAddFieldDialogProps) => {

    const dispatch = useAppDispatch()
    const [fields, setFields] = useState<FieldDevice[]>(props?.fields ?? [])

	const changeField = (field: FieldDevice, index: number) => {
		setFields(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.slice()
				fields[index] = field
				return fields
			}
		})
	}

	const showEditFieldDialog = useCallback((index:number) => {
		dispatch(showFullScreenDialog(<DeviceAddField field={fields[index]} option={props.option} setField={(field)=>changeField(field, index)}/>))
	},[dispatch, fields])

	const deleteField = useCallback((id:number) => {
		setFields(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.filter((_,index)=>index !== id)
				return fields
			}
		})
	},[setFields])

	const deleteFieldDialog = useCallback((id: number) => {
		dispatch(showDialog(<BaseDialog 
			actionText='delete' 
			header='delete field' 
			text='are you sure you want to delete the field.' 
			onHide={()=>dispatch(hideDialog())}
			onSuccess={()=>deleteField(id)}
		/>))
	},[dispatch, deleteField])

	const addField = useCallback(() => {
		dispatch(showFullScreenDialog(<DeviceAddField field={{
			name:"",
			type: DeviceFieldType.NUMBER,
			low:"0",
			high:"100",
			unit:"",
			address:"",
			value:"",
			read_only: true,
			enum_values: "",
			icon: "",
			entity: "",
			virtual_field: props.option.virtual
		}} option={props.option} setField={(field)=>{
			setFields(prev=>{
				if(!prev)
					return prev
				else{
					let fields = prev.slice()
					fields.push(field)
					return fields
				}
			})
		}}/>))
        
	},[dispatch])

	const next = useCallback(() => {
		if(props.option.added.fields && fields.length === 0)
		{
			dispatch(showDialog(<BaseDialog 
				actionText='ok' 
				header='fields are missing' 
				text='no fields have been created. Are you sure you want to continue?' 
				onHide={()=>dispatch(hideDialog())}
				onSuccess={()=>props.onNext(fields)}
			/>))
		}
		else
			props.onNext(fields)
	},[fields])

	return(
		<>
			<div className="device-add-container">
				<div className="device-add-body">
						<h3 className='device-add-fields'>Fields</h3>
						<ListContainer transparent>
							{
								fields.map((item, index)=>(
									<ListItem 
									key={index} 
									header={item.name} 
									text={`type: ${item.type}`} 
									hovered 
									onClick={()=>showEditFieldDialog(index)}
									control={(props.option.change.fields.deleted)?<Trash2 color='var(--Error-color)' onClick={()=>deleteFieldDialog(index)}/>:null}
									/>
								))
							}
						</ListContainer>
						<div className="device-add-container btn-container">
                        	<Button onClick={addField}>add field</Button>
							<Button onClick={props.onPrev}>Back</Button>
							<FilledButton onClick={next}>Next</FilledButton>
						</div>
				</div>
			</div>
		</>
	)
}