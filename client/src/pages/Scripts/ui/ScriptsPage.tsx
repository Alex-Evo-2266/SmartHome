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
import { Script } from '../../../entites/Script'
import { useGetScripts } from '../api/apiScripts'

export const ScriptsPage = () => {

    const dispatch = useAppDispatch()
    const [triggers, setTriggers] = useState<AutomationData[]>([])
    const [Scripts, setScripts] = useState<Script[]>([])
    const APIAutomations = useGetAutomations()
    const APIScripts = useGetScripts()
    const navigate = useNavigate()

    const getAutomationsF = useCallback(async ()=>{
        const data:AutomationData[] = await APIAutomations.getAutomations()
        setTriggers(data)
    },[APIAutomations.getAutomations])

    const getScriptsF = useCallback(async ()=>{
        const data:Script[] = await APIScripts.getScripts()
        setScripts(data)
    },[APIScripts.getScripts])

    useEffect(()=>{
        getAutomationsF()
    },[getAutomationsF])

    useEffect(()=>{
        getScriptsF()
    },[getScriptsF])

    const addAutomation = () => {
		dispatch(showFullScreenDialog(<AutomationForm header='Add automation' update={getAutomationsF}/>))
	}

    const editAutomation = (data: AutomationData) => {
		dispatch(showFullScreenDialog(<AutomationForm header='Edit automation' editData={data} update={getAutomationsF}/>))
	}

    const deleteAutomation = useCallback(async (system_name: string) => {
		await APIAutomations.deleteAutomations(system_name)
        // getAutomationsF()
        setTimeout(()=>{
            getAutomationsF()
        },300)
	},[getAutomationsF, APIAutomations.deleteAutomations])

    const setStatusAutomation = useCallback(async (system_name: string, status: boolean) => {
		await APIAutomations.setStatusAutomations(system_name, status)
        // getAutomationsF()
        setTimeout(()=>{
            getAutomationsF()
        },300)
	},[getAutomationsF, APIAutomations.setStatusAutomations])

    const editScript = (data: Script) => {
		navigate(`/scripts/constructor/${data.system_name}`)
	}

    const deleteScript = useCallback(async (system_name: string) => {
		await APIScripts.deleteScripts(system_name)
        // getScriptsF()
        setTimeout(()=>{
            getScriptsF()
        },300)
	},[getScriptsF, APIScripts.deleteScripts])

    return(
        <div className="scripts-page-container">
            <div className='automations'>
                <AutomationsCard loading={APIAutomations.loading} automations={triggers} onAddAutomation={addAutomation} onStatusAutomation={setStatusAutomation} onEditAutomation={editAutomation} onDeleteAutomation={deleteAutomation} update={getAutomationsF}/>
            </div>
            <div className='scripts'>
                <ScriptsCard loading={APIScripts.loading} scripts={Scripts} onAddScripts={()=>navigate("/scripts/constructor")} onDeleteScripts={deleteScript} onEditScripts={editScript} update={getScriptsF}/>
            </div>
        </div>
    )
}