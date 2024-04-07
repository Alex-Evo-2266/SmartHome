import { useCallback } from 'react'
import { Card, ListContainer } from '../../../shared/ui'
import { ScriptButtons } from './ScriptButton'
import './ScriptCard.scss'
import { ScriptsItem } from './ScriptItem'
import { Script } from '../../../entites/Script'

interface ScriptsCardProps{
	className?: string
    onAddScripts:()=>void
    onEditScripts:(data: Script)=>void
    onDeleteScripts:(system_name: string)=>void
    loading: boolean
    scripts: Script[]
    update: ()=>void
}

export const ScriptsCard = ({className, onAddScripts, onEditScripts, loading, scripts, onDeleteScripts}:ScriptsCardProps) => {

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
                            <ScriptsItem key={index} scriptsData={item} onDeleteScript={onDeleteScripts} onEditScript={onEditScripts}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
