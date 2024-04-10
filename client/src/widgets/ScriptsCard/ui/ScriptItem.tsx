import { useCallback } from 'react'
import { BaseDialog, IconButton, ListItem } from '../../../shared/ui'
import './ScriptCard.scss'
import { MoreVertical } from 'lucide-react'
import { IMenuItem } from '../../../shared/model/menu'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { Script } from '../../../entites/Script'
import { UseStartScript } from '../api/APIStartScript'

interface ScriptsItemProps{
	scriptsData: Script
    onEditScript:(data: Script)=>void
    onDeleteScript:(system_name: string)=>void
}

export const ScriptsItem = ({scriptsData, onEditScript, onDeleteScript}:ScriptsItemProps) => {

    const dispatch = useAppDispatch()
    const {startScript} = UseStartScript()

    const deleteScript = useCallback(()=>{
        dispatch(showDialog(<BaseDialog header='delete script' text='are you sure you want to delete the script.' onHide={()=>dispatch(hideDialog())} onSuccess={()=>{
            onDeleteScript(scriptsData.system_name)
        }}/>))
    },[onDeleteScript])

    const getMenu = useCallback(():IMenuItem[] => {
		let arr:IMenuItem[] = [{
			title: "delete",
			onClick: deleteScript
		},{
			title: "start",
			onClick: ()=>startScript(scriptsData.system_name)
		}]
		return arr
	},[scriptsData, deleteScript])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

    return(
        <ListItem header={scriptsData.name} text={`system name: ${scriptsData.system_name}.`} hovered control={
            <IconButton icon={<MoreVertical/>} onClick={onMenu}/>
        } onClick={()=>onEditScript(scriptsData)}/>
    )
}
