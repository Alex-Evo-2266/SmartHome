import { useCallback } from 'react'
import { Card, ListContainer } from '../../../shared/ui'
import { TriggersButtons } from './TriggersButton'
import './TriggersCard.scss'
import { TriggerData } from '../../../entites/Trigger'
import { TriggersItem } from './TriggerItem'

interface TriggersCardProps{
	className?: string
    onAddTrigger:()=>void
    onEditTrigger:(data: TriggerData)=>void
    onDeleteTrigger:(system_name: string)=>void
    onStatusTrigger:(system_name: string, status: boolean)=>void
    loading: boolean
    triggers: TriggerData[]
    update: ()=>void
}

export const TriggersCard = ({className, onAddTrigger, onEditTrigger, loading, triggers, onDeleteTrigger, onStatusTrigger}:TriggersCardProps) => {

    const addTrigger = useCallback(()=>{
        onAddTrigger()
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
                            <TriggersItem key={index} triggerData={item} onDeleteTrigger={onDeleteTrigger} onEditTrigger={onEditTrigger} onStatusTrigger={onStatusTrigger}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
