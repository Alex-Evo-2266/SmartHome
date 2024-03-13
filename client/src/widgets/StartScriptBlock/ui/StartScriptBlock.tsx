import './StartScriptBlock.scss'
import { IMenuItem } from "../../../shared/model/menu"
import { Button, TextField } from '../../../shared/ui'
import { AutomationEntitiesField } from '../../../features/AutomationEntityField'
import { useState } from 'react'
import { AutomationEntityData } from '../../../entites/Automation'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'

interface ScriptBlockActionProps{
    save: (triggers: AutomationEntityData[], scriptName:string)=>void
    menuItem?: IMenuItem[]
}

export const StartScriptBlock = ({save, menuItem}:ScriptBlockActionProps) => {

    const [trigger, setTrigger] = useState<AutomationEntityData[]>([])
    const [scriptName, setScriptName] = useState<string>("")
    const dispatch = useAppDispatch()

    const menu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if(menuItem)
        {
            dispatch(showBaseMenu(menuItem, e.clientX, e.clientY))
        }
    }

    return(
        <div className='start-script-block'>
            <div className='script-name'>
                <TextField border value={scriptName} onChange={(e)=>setScriptName(e.target.value)}/>
            </div>
            <div className='script-item script-trigger' onContextMenu={menu}>
                <h4>trigger</h4>
                    <AutomationEntitiesField onChange={(data)=>setTrigger(data)} value={trigger}/>
            </div>
            <Button style={{width:"calc(100% - 10px)"}} onClick={()=>save(trigger, scriptName)}>save</Button>
        </div>
    )
}
