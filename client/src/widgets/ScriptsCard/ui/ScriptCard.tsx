import { useCallback } from 'react'
import { Card, ListContainer } from '../../../shared/ui'
import { ScriptButtons } from './ScriptButton'
import './ScriptCard.scss'
import { AutomationData } from '../../../entites/Automation'
import { ScriptsItem } from './ScriptItem'

interface ScriptsCardProps{
	className?: string
    onAddScripts:()=>void
    onEditScripts:(data: AutomationData)=>void
    onDeleteScripts:(system_name: string)=>void
    onStatusScripts:(system_name: string, status: boolean)=>void
    loading: boolean
    scripts: AutomationData[]
    update: ()=>void
}

export const ScriptsCard = ({className, onAddScripts, onEditScripts, loading, scripts, onDeleteScripts, onStatusScripts}:ScriptsCardProps) => {

    const addScript = useCallback(()=>{
        onAddScripts()
    },[])

    return(
        <Card className={`automations-list-card ${className ?? ""}`} header='Scripts' action={<ScriptButtons onAddScript={addScript}/>}>
            <div className='automations-list'>
            {
                (loading)?
                <div> loding....</div>:
                <ListContainer transparent>
                    {
                        scripts.map((item, index)=>(
                            <ScriptsItem key={index} scriptsData={item} onDeleteScript={onDeleteScripts} onEditScript={onEditScripts} onStatusScript={onStatusScripts}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
