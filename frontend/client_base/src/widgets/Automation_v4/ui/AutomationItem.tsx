import { ListItem, Switch } from "alex-evo-sh-ui-kit"
import { useCallback, useRef, useState } from "react"
import type { ChangeEvent, MouseEvent } from "react"
import { useNavigate } from 'react-router-dom';

import { Automation, useAutomationAPI } from "../../../entites/automation_v4"
import './style.scss'

interface AutomationItemProps {
    automation: Automation
    onAutomationChange: (automation: Automation) => void
}


export const AutomationItem:React.FC<AutomationItemProps> = ({automation, onAutomationChange}) => {

    const navigate = useNavigate()
    const { enableAutomation } = useAutomationAPI()
    const [updating, setUpdating] = useState(false)
    const updateInProgress = useRef(false)

    const editScript = useCallback(() => {
        navigate(`/automation/${automation.id}`)
    },[automation.id, navigate])

    const changeEnabled = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation()
        if (updateInProgress.current) return

        const enabled = event.currentTarget.checked
        updateInProgress.current = true
        setUpdating(true)
        try {
            const updated = await enableAutomation(automation.id, enabled)
            onAutomationChange(updated)
        } catch {
            // useAutomationAPI reports request failures through useSnackbar.
        } finally {
            updateInProgress.current = false
            setUpdating(false)
        }
    }, [automation.id, enableAutomation, onAutomationChange])


    return(
        <>
        <ListItem
            hovered
            header={automation.name}
            onClick={editScript}
            control={
                <Switch
                    size='small'
                    checked={automation.is_enabled}
                    disabled={updating}
                    onClick={(event: MouseEvent<HTMLInputElement>) => event.stopPropagation()}
                    onChange={changeEnabled}
                />
            }
            text={`triggers: ${automation.trigger.map(item=>item.type)}`}
        />

        </>
    )
}