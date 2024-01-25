import { useCallback, useEffect, useState } from 'react'
import { Card, ListContainer, Search } from '../../../shared/ui'
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

    const [filtredAutomation, setAutomation] = useState<AutomationData[]>([])
    const [search, setSearch] = useState<string>("")

    const addAutomation = useCallback(()=>{
        onAddAutomation()
    },[])

    const filterdAutomation = useCallback((data:string)=>{
		if(data===""){
			setAutomation(automations)
			return
		}
		let array = automations.filter(item => item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
		setAutomation(array)
	},[automations])

	useEffect(()=>{
		filterdAutomation(search)
	},[filterdAutomation, search])

    return(
        <Card className={`automations-list-card ${className ?? ""}`} header='Automations' action={<AutomationButtons onAddAutomation={addAutomation}/>}>
            <div className='search-automation'>
                <Search autoChenge onSearch={data=>setSearch(data)}/>
            </div>
            <div className='automations-list'>
            {
                (loading)?
                <div> loding....</div>:
                <ListContainer transparent>
                    {
                        filtredAutomation.map((item, index)=>(
                            <AutomationsItem key={index} automationData={item} A onDeleteAutomation={onDeleteAutomation} onEditAutomation={onEditAutomation} onStatusAutomation={onStatusAutomation}/>
                        ))
                    }
                </ListContainer>
                
            }
            </div>
        </Card>
    )
}
