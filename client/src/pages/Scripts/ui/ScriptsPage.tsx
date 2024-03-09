import { useCallback, useEffect, useState } from 'react'
import { AutomationData } from '../../../entites/Automation'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { AutomationForm } from '../../../widgets/AutomationForm'
import { AutomationsCard } from '../../../widgets/AutomationsCard'
import './ScriptsPage.scss'
import { useGetAutomations } from '../api/apiAutomations'
import { ScriptsCard } from '../../../widgets/ScriptsCard'
import { useNavigate } from 'react-router-dom'
import { FormatText } from '../../../shared/ui/FormatText/FormatText'

export const ScriptsPage = () => {

    const dispatch = useAppDispatch()
    const [triggers, setTriggers] = useState<AutomationData[]>([])
    const {getAutomations, loading, deleteAutomations, setStatusAutomations} = useGetAutomations()
    const navigate = useNavigate()

    const getAutomationsF = useCallback(async ()=>{
        const data:AutomationData[] = await getAutomations()
        setTriggers(data)
    },[getAutomations])

    useEffect(()=>{
        getAutomationsF()
    },[getAutomationsF])

    const addAutomation = () => {
		dispatch(showFullScreenDialog(<AutomationForm header='Add automation' update={getAutomationsF}/>))
	}

    const editAutomation = (data: AutomationData) => {
		dispatch(showFullScreenDialog(<AutomationForm header='Edit automation' editData={data} update={getAutomationsF}/>))
	}

    const deleteAutomation = async (system_name: string) => {
		await deleteAutomations(system_name)
        setTimeout(()=>{
            getAutomationsF()
        },300)
	}

    const setStatusAutomation = async (system_name: string, status: boolean) => {
		await setStatusAutomations(system_name, status)
        setTimeout(()=>{
            getAutomationsF()
        },300)
	}

    return(
        <div className="scripts-page-container">
            <div className='automations'>
                <AutomationsCard loading={loading} automations={triggers} onAddAutomation={addAutomation} onStatusAutomation={setStatusAutomation} onEditAutomation={editAutomation} onDeleteAutomation={deleteAutomation} update={getAutomationsF}/>
            </div>
            <div className='scripts'>
                <ScriptsCard loading={false} scripts={[]} onAddScripts={()=>navigate("/scripts/constructor")} onDeleteScripts={()=>{}} onEditScripts={()=>{}} onStatusScripts={()=>{}} update={()=>{}}/>
            </div>
            <div>
                <FormatText border dict={[
                    {
                        data: "device",
                        list: [{
                            data: "lamp1",
                            color: "orange"
                        }],
                        color: "red"
                    },
                    {
                        data: "=",
                        color: "aqua"
                    }
                ]}/>
            </div>
        </div>
    )
}