import { useCallback } from 'react'
import { BaseDialog, IconButton, ListItem } from "alex-evo-sh-ui-kit"
import './AutomationsCard.scss'
import { AutomationData } from '../../../entites/Automation'
import { Ban, Check, MoreVertical } from 'lucide-react'
import { IMenuItem } from "alex-evo-sh-ui-kit"
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'

interface AutomationItemProps{
	automationData: AutomationData
    onEditAutomation:(data: AutomationData)=>void
    onDeleteAutomation:(system_name: string)=>void
    onStatusAutomation:(system_name: string, status: boolean)=>void
}

export const AutomationsItem = ({automationData, onEditAutomation, onDeleteAutomation, onStatusAutomation}:AutomationItemProps) => {

    const dispatch = useAppDispatch()

    const deleteAutomation = useCallback(()=>{
        dispatch(showDialog(<BaseDialog header='delete automation' text='are you sure you want to delete the automation.' onHide={()=>dispatch(hideDialog())} onSuccess={()=>{
            onDeleteAutomation(automationData.system_name)
        }}/>))
    },[onDeleteAutomation])

    const getMenu = useCallback(():IMenuItem[] => {
		let arr:IMenuItem[] = [{
			title: "delete",
			onClick: deleteAutomation
		}]
		if(automationData.status)
			arr.push({
				title: "off",
				onClick: ()=>onStatusAutomation(automationData.system_name, false)
			})
		else
			arr.push({
				title: "on",
				onClick: ()=>onStatusAutomation(automationData.system_name, true)
			})
		return arr
	},[automationData, deleteAutomation])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

    return(
        <ListItem icon={(automationData.status)?<Check color='green'/>:<Ban color='var(--Error-color)'/>} header={automationData.name} text={`system name: ${automationData.system_name}. ststus: ${automationData.status}`} hovered control={
            <IconButton icon={<MoreVertical/>} onClick={onMenu}/>
        } onClick={()=>onEditAutomation(automationData)}/>
    )
}
