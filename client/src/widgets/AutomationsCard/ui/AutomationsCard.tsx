import { useCallback } from 'react'
import { Card, ListContainer } from '../../../shared/ui'
import { AutomationButtons } from './AutomationsButton'
import './AutomationsCard.scss'
import { AutomationData } from '../../../entites/Automation'
import { AutomationsItem } from './AutomationItem'

interface AutomationsCardProps{
	className?: string
    onAddAutomation:()=>void
    onEditAutomation:(data: AutomationData)=>void
    onDeleteAutomation:(system_name: string)=>void
    onStatusAutomation:(system_name: string, status: boolean)=>void
    loading: boolean
    automations: AutomationData[]
    update: ()=>void
}

export const AutomationsCard = ({className, onAddAutomation, onEditAutomation, loading, automations, onDeleteAutomation, onStatusAutomation}:AutomationsCardProps) => {

    const addAutomation = useCallback(()=>{
        onAddAutomation()
    },[])

    return(
        <Card className={`automations-list-card ${className ?? ""}`} header='Automations' action={<AutomationButtons onAddAutomation={addAutomation}/>}>
            <div className='automations-list'>
            {
                (loading)?
                <div> loding....</div>:
                <ListContainer transparent>
                    {
                        automations.map((item, index)=>(
                            <AutomationsItem key={index} automationData={item} onDeleteAutomation={onDeleteAutomation} onEditAutomation={onEditAutomation} onStatusAutomation={onStatusAutomation}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
