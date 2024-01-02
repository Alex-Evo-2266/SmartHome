import { useCallback, useEffect, useState } from 'react'
import { TriggerData } from '../../../entites/Trigger'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { TriggerForm } from '../../../widgets/TriggerForm'
import { TriggersCard } from '../../../widgets/TriggersCard'
import './ScriptsPage.scss'
import { useGetTriggers } from '../api/apiTriggers'

export const ScriptsPage = () => {

    const dispatch = useAppDispatch()
    const [triggers, setTriggers] = useState<TriggerData[]>([])
    const {getTriggers, loading, deleteTriggers} = useGetTriggers()

    const getTriggersF = useCallback(async ()=>{
        const data:TriggerData[] = await getTriggers()
        setTriggers(data)
    },[getTriggers])

    useEffect(()=>{
        getTriggersF()
    },[getTriggersF])

    const addTrigger = () => {
		dispatch(showFullScreenDialog(<TriggerForm header='Add trigger' update={getTriggersF}/>))
	}

    const editTrigger = (data: TriggerData) => {
		dispatch(showFullScreenDialog(<TriggerForm header='Edit trigger' editData={data} update={getTriggersF}/>))
	}

    const deleteTrigger = async (system_name: string) => {
		await deleteTriggers(system_name)
        setTimeout(()=>{
            getTriggersF()
        },300)
	}

    return(
        <div className="scripts-page-container">
            <div className='trigger'>
                <TriggersCard loading={loading} triggers={triggers} onAddTrigger={addTrigger} onEditTrigger={editTrigger} onDeleteTrigger={deleteTrigger} update={getTriggersF}/>
            </div>
            {/* <Profile className='profile-settings'/> */}
        </div>
    )
}