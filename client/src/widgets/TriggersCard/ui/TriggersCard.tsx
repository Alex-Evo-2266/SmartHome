import { useCallback } from 'react'
import { Card, ListContainer, ListItem } from '../../../shared/ui'
import { TriggersButtons } from './TriggersButton'
import './TriggersCard.scss'
import { TriggerData } from '../../../entites/Trigger'
import { Trash2 } from 'lucide-react'

interface TriggersCardProps{
	className?: string
    onAddTrigger:()=>void
    onEditTrigger:(data: TriggerData)=>void
    onDeleteTrigger:(system_name: string)=>void
    loading: boolean
    triggers: TriggerData[]
    update: ()=>void
}

export const TriggersCard = ({className, onAddTrigger, onEditTrigger, loading, triggers, onDeleteTrigger}:TriggersCardProps) => {

    const editTrigger = useCallback((data: TriggerData)=>{
        onEditTrigger(data)
    },[])

    const addTrigger = useCallback(()=>{
        onAddTrigger()
    },[])

    const deleteTrigger = useCallback((system_name: string)=>{
        onDeleteTrigger(system_name)
    },[])

    return(
        <Card className={`triggers-list-card ${className ?? ""}`} header='Triggers' action={<TriggersButtons onAddTrigger={addTrigger}/>}>
            <div className='triggers-list'>
            {
                (loading)?
                <div> loding....</div>:
                <ListContainer transparent>
                    {
                        triggers.map((item, index)=>(
                            <ListItem key={index} header={item.name} text={`system name: ${item.system_name}. `} hovered control={<Trash2 onClick={()=>deleteTrigger(item.system_name)} color='var(--Error-color)'/>} onClick={()=>editTrigger(item)}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
