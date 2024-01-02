import { useCallback } from 'react'
import { BaseDialog, IconButton, ListItem } from '../../../shared/ui'
import './TriggersCard.scss'
import { TriggerData } from '../../../entites/Trigger'
import { Ban, Check, MoreVertical, Trash2 } from 'lucide-react'
import { IMenuItem } from '../../../shared/model/menu'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'

interface TriggersItemProps{
	triggerData: TriggerData
    onEditTrigger:(data: TriggerData)=>void
    onDeleteTrigger:(system_name: string)=>void
    onStatusTrigger:(system_name: string, status: boolean)=>void
}

export const TriggersItem = ({triggerData, onEditTrigger, onDeleteTrigger, onStatusTrigger}:TriggersItemProps) => {

    const dispatch = useAppDispatch()

    const deleteTrigger = useCallback(()=>{
        dispatch(showDialog(<BaseDialog header='delete trigger' text='are you sure you want to delete the trigger.' onHide={()=>dispatch(hideDialog())} onSuccess={()=>{
            onDeleteTrigger(triggerData.system_name)
        }}/>))
    },[onDeleteTrigger])

    const getMenu = useCallback(():IMenuItem[] => {
		let arr:IMenuItem[] = [{
			title: "delete",
			onClick: deleteTrigger
		}]
		if(triggerData.status)
			arr.push({
				title: "off",
				onClick: ()=>onStatusTrigger(triggerData.system_name, false)
			})
		else
			arr.push({
				title: "on",
				onClick: ()=>onStatusTrigger(triggerData.system_name, true)
			})
		return arr
	},[triggerData, deleteTrigger])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

    return(
        <ListItem icon={(triggerData.status)?<Check color='green'/>:<Ban color='var(--Error-color)'/>} header={triggerData.name} text={`system name: ${triggerData.system_name}. ststus: ${triggerData.status}`} hovered control={
            <IconButton icon={<MoreVertical/>} onClick={onMenu}/>
        } onClick={()=>onEditTrigger(triggerData)}/>
    )
}
