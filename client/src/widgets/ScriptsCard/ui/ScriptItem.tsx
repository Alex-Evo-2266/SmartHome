import { useCallback } from 'react'
import { BaseDialog, IconButton, ListItem } from '../../../shared/ui'
import './ScriptCard.scss'
import { AutomationData } from '../../../entites/Automation'
import { Ban, Check, MoreVertical } from 'lucide-react'
import { IMenuItem } from '../../../shared/model/menu'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'

interface AutomationItemProps{
	scriptsData: AutomationData
    onEditScript:(data: AutomationData)=>void
    onDeleteScript:(system_name: string)=>void
    onStatusScript:(system_name: string, status: boolean)=>void
}

export const ScriptsItem = ({scriptsData, onEditScript, onDeleteScript, onStatusScript}:AutomationItemProps) => {

    const dispatch = useAppDispatch()

    const deleteScript = useCallback(()=>{
        dispatch(showDialog(<BaseDialog header='delete automation' text='are you sure you want to delete the automation.' onHide={()=>dispatch(hideDialog())} onSuccess={()=>{
            onDeleteScript(scriptsData.system_name)
        }}/>))
    },[onDeleteScript])

    const getMenu = useCallback(():IMenuItem[] => {
		let arr:IMenuItem[] = [{
			title: "delete",
			onClick: deleteScript
		}]
		if(scriptsData.status)
			arr.push({
				title: "off",
				onClick: ()=>onStatusScript(scriptsData.system_name, false)
			})
		else
			arr.push({
				title: "on",
				onClick: ()=>onStatusScript(scriptsData.system_name, true)
			})
		return arr
	},[scriptsData, deleteScript])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

    return(
        <ListItem icon={(scriptsData.status)?<Check color='green'/>:<Ban color='var(--Error-color)'/>} header={scriptsData.name} text={`system name: ${scriptsData.system_name}. ststus: ${scriptsData.status}`} hovered control={
            <IconButton icon={<MoreVertical/>} onClick={onMenu}/>
        } onClick={()=>onEditScript(scriptsData)}/>
    )
}
