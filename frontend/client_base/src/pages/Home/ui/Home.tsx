import { DashboardPageContext, useDashboardAPI } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { Tabs } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import './Home.scss'
import { WidgetsStoreContext, WidgetStore } from "@src/pages/Dashboards/helpers/widgetsStore"
import { Dashboard, DashboardMainProvider } from "alex-evo-web-constructor"

export const HomePage = () => {

    const {rooms} = useRoom()
    const {getActiveDashboardsCard} = useDashboardAPI()
    const [dashboards, setDashboards] = useState<{id:string, title:string}[]>([])
    const widgetsStore = useMemo(()=>new WidgetStore(),[]) 

    const load = useCallback(async() => {
        const data = await getActiveDashboardsCard()
        if(data)
            setDashboards(data) 
    },[getActiveDashboardsCard])

    useEffect(()=>{
        load()
    },[load])

     const tabs = useMemo(() => {
        const data = dashboards.map((item, index) => {
            return {
                label: item.title,
                content: <></>
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
            <div>
                {/* <WidgetsStoreContext.Provider value={widgetsStore}>
                    <DashboardMainProvider
                        runtime={runtime}
                        schema={schema}
                    >
                        <Dashboard
                            schema={schema}
                        />
                    </DashboardMainProvider>
                </WidgetsStoreContext.Provider> */}
            </div>
        </DashboardPageContext.Provider>
        
    )
}