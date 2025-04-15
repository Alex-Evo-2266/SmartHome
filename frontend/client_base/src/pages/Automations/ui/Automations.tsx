import { useScreenSize, ScreenSize, Tabs } from "alex-evo-sh-ui-kit"

import './Automations.scss'
import { useState } from "react"
import { AutomationCard } from "../../../widgets/AutomationCard"

export const AutomationPage = () => {

    const {screen} = useScreenSize()
    const [pageNumber, setPageNumber] = useState(0)

    const tabs = [
        {label: "automation", content: null},
        {label: "script", content: null},
    ]

    if(screen === ScreenSize.MOBILE)
    {
        return(
            <div className="automation-page-small container-page">
                <Tabs tabs={tabs} activeTabIndex={pageNumber} tabContainerClassName="tabs-container" onTabClick={setPageNumber}/>
                <div style={{marginTop: '5px'}}>
                {
                    pageNumber == 0?
                    <AutomationCard/>:
                    pageNumber == 1?
                    null:
                    null
                }
                </div>
            </div>
        )
    }

    return(
        <div className="automation-page container-page">
            <AutomationCard/>
        </div>
    )
}
