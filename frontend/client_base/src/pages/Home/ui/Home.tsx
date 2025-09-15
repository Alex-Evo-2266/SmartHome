import { GridLayout, GridLayoutItem, ScreenSize, Tabs, useScreenSize } from "alex-evo-sh-ui-kit"
import { Dashboard, DashboardPageContext, useDashboardAPI, WIDTH_PANEL } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { Menu } from "@src/shared"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getModuleButtons, Navigation, useMainButtons } from "@src/widgets/Navigation"
import { useNavigationData } from "@src/entites/navigation"
import { getBarButtonsHomePage } from "@src/widgets/Navigation/config/barButtons"
import './Home.scss'
import { PreviewDashboard } from "@src/widgets/Dashboard/ui/Dashboard"
import { GridCard } from "@src/widgets/Dashboard"

export const HomePage = () => {

    const {rooms} = useRoom()
    const {navigation} = useNavigationData()
    const mainBtn = useMainButtons()
    const {getUserDashboard} = useDashboardAPI()
    const {screen} = useScreenSize()
    const [dashboards, setDashboards] = useState<Dashboard[]>([])

    const load = useCallback(async() => {
        const data = await getUserDashboard()
        if(data)
            setDashboards(data) 
    },[getUserDashboard])

    useEffect(()=>{
        load()
    },[load])

     const tabs = useMemo(() => {
        const data = dashboards.map((item, index) => {
            return {
                label: item.title,
                content: <PreviewDashboard dashboard={item} key={`dashboard-tab-${index}`}/>
            }
        })
        if(data.length === 0)
        {
            return [{
                label: "dashboard1",
                content: <div>empty</div>
            }]
        }
        return data
    },[dashboards])

    const style = 
    screen === ScreenSize.MOBILE?
    {
        marginBlockEnd: "80px"
    }:
    screen === ScreenSize.STANDART?
    {
        marginInlineStart: "80px"
    }:
    {
        marginInlineStart: "360px"
    }

   

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <Menu/>
            <Navigation mainBtn={mainBtn} otherBtn={getModuleButtons(navigation)} barBtn={getBarButtonsHomePage()}/>
              
            <div className="home-page container-page" style={style}>
                <Tabs tabs={tabs}/>
            </div>
        </DashboardPageContext.Provider>
        
    )
}