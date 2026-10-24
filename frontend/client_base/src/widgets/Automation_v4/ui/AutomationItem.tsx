import { ListItem, Switch } from "alex-evo-sh-ui-kit"

import { Automation } from "../../../entites/automation_v4"
import { useNavigate } from 'react-router-dom';
import './style.scss'
import { useCallback } from "react"

interface AutomationItemProps {
    automation: Automation
}


export const AutomationItem:React.FC<AutomationItemProps> = ({automation}) => {

    const navigate = useNavigate()

    const editScript = useCallback(() => {
        navigate(`/automation/${automation.id}`)
    },[automation])


    return(
        <>
        <ListItem
            hovered
            header={automation.name}
            onClick={editScript}
            control={<Switch size='small' checked={automation.is_enabled}/>}
            text={`triggers: ${automation.trigger.map(item=>item.type)}`}
        />

        </>
    )
}