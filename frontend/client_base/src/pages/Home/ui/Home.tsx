import { Dashboard, DashboardPageContext, useDashboardAPI } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { PreviewDashboard } from "@src/widgets/Dashboard/ui/Dashboard"
import { Tabs } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import './Home.scss'

export const HomePage = () => {

    const {rooms} = useRoom()
    const {getUserDashboard} = useDashboardAPI()
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

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <div className="home-page container-page">
                <Tabs tabs={tabs}/>
            </div>
        </DashboardPageContext.Provider>
        
    )
}