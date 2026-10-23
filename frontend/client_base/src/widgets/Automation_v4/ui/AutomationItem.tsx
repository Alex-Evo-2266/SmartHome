import { ListItem, Switch } from "alex-evo-sh-ui-kit"

import { Automation } from "../../../entites/automation"
import './style.scss'
import { joinAutomation } from "../../../shared/lib/helpers/joinAutomation"

interface AutomationItemProps {
    automation: Automation
    updateData: ()=>Promise<void>
}


export const AutomationItem:React.FC<AutomationItemProps> = ({automation, updateData}) => {


    return(
        <>
        <ListItem
            hovered
            header={automation.name}
            control={<Switch size='small' checked={automation.is_enabled}/>}
            text={`triggers: ${automation.trigger.map(item=>joinAutomation([item.service, item.trigger], item.option))}`}
        />

        </>
    )
}