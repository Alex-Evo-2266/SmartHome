import './StartScriptBlock.scss'
import { IMenuItem } from "../../../shared/model/menu"
import { Button, ListContainer, ListItem } from '../../../shared/ui'
import { AutomationEntitiesField, useAutomationTrigger } from '../../../features/Automation'
import { useCallback, useEffect, useState } from 'react'
import { AutomationEntityData, TypeEntity } from '../../../entites/Automation'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { hideFullScreenDialog, showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { ScriptNameDialog } from './NameScriptDialog'
import { ChevronRight } from 'lucide-react'

interface ScriptBlockActionProps{
    save: (triggers: AutomationEntityData[], scriptName:string, scriptSystemName:string)=>void
    menuItem?: IMenuItem[]
    name?: string
    system_name?: string
}

export const StartScriptBlock = ({save, menuItem, name, system_name}:ScriptBlockActionProps) => {

    const [trigger, setTrigger] = useState<AutomationEntityData[]>([])
    const [scriptName, setScriptName] = useState<string>(name ?? "")
    const [scriptSystemName, setScriptSystemName] = useState<string>(system_name ?? "")
    const dispatch = useAppDispatch()
    const {addValue} = useAutomationTrigger()

    const menu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if(menuItem)
        {
            dispatch(showBaseMenu(menuItem, e.clientX, e.clientY))
        }
    }

    const entredName = useCallback(() => {
        dispatch(showFullScreenDialog(<ScriptNameDialog beginName={scriptName} beginSystemName={scriptSystemName} onHide={()=>dispatch(hideFullScreenDialog())} onSave={(name, systemName)=>{
            setScriptSystemName(systemName)
            setScriptName(name)
            dispatch(hideFullScreenDialog())
        }}/>))
    },[dispatch, scriptName, scriptSystemName])

    const addTrigger = useCallback(() => {
        addValue((type_entity:TypeEntity, data: string)=>{
            let newValue = [...trigger, {
                entity: data,
                type_entity: type_entity
            }]
            setTrigger(newValue)
        })
    },[addValue, trigger])

    useEffect(()=>{
        name && setScriptName(name)
        system_name && setScriptSystemName(system_name)
    },[name, system_name])

    return(
        <div className='start-script-block'>
            <ListContainer className='script-name-container' transparent>
                <ListItem className='script-name' onClick={entredName} header={(scriptName === "")?"specify the script name":scriptName} control={<ChevronRight/>}/>
            </ListContainer>
            {
                (trigger.length === 0)?
                <ListContainer className='script-trigger-container' transparent>
                    <ListItem className='script-trigger' onClick={addTrigger} header="added trigger" control={<ChevronRight/>}/>
                </ListContainer>:
                <div className='script-item script-trigger' onContextMenu={menu}>
                    <h4>trigger</h4>
                        <AutomationEntitiesField onChange={(data)=>setTrigger(data)} value={trigger}/>
                </div>
            }
            <Button style={{width:"calc(100% - 10px)"}} onClick={()=>save(trigger, scriptName, scriptSystemName)}>save</Button>
        </div>
    )
}
