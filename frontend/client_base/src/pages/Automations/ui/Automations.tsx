import { useScreenSize, ScreenSize, Tabs } from "alex-evo-sh-ui-kit"
import { useState } from "react"

import { AutomationCard as Ac } from "../../../widgets/AutomationCard"
import { ScriptCard } from "../../../widgets/ScriptCard"
import './Automations.scss'
import { AutomationCard } from "@src/widgets/Automation_v4/ui/AutomationList"
import { AutomationEditor } from "@src/widgets/Automation_v4/ui/AutomationEditor"

export const AutomationPage = () => {

    const {screen} = useScreenSize()
    const [pageNumber, setPageNumber] = useState(0)

    const tabs = [
        {label: "automation", content: null},
        {label: "script", content: null},
        {label: "automationv4", content: null},
    ]

    if(screen === ScreenSize.MOBILE)
    {
        return(
            <div className="automation-page-small container-page">
                <Tabs tabs={tabs} activeTabIndex={pageNumber} tabContainerClassName="tabs-container" onTabClick={setPageNumber}/>
                <div style={{marginTop: '5px'}}>
                {
                    pageNumber == 0?
                    <Ac/>:
                    pageNumber == 1?
                    <ScriptCard/>:
                    pageNumber == 2?
                    <AutomationCard/>:
                    null
                }
                </div>
            </div>
        )
    }

    return(
        <>
            <div className="automation-page container-page">
                <Ac/>
                <ScriptCard/>
                <AutomationCard/>
            </div>

        </>
        
    )
}
