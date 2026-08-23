import { DashboardPageContext, useDashboardAPI, useDashboardData } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { Tabs } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import './Home.scss'
import { useDashboardRuntimeData } from "@src/features/Dashboard"
import { WidgetsStoreContext } from "@src/features/Dashboard/helpers/widgetsStore"
import { Dashboard, DashboardMainProvider } from "alex-evo-web-constructor"

export const HomePage = () => {

    const {rooms} = useRoom()
    const {getActiveDashboardsCard} = useDashboardAPI()
    const [dashboards, setDashboards] = useState<{id:string, title:string}[]>([])

    const tabs = useMemo(() => {
        const data = dashboards.map((item) => {
            return {
                label: item.title,
                data: item.id
            }
        })
        const dataTabs = data.map(item=>({label: item.label, content:<></>}))
        if(dataTabs.length === 0)
        {
            return {dataTabs:[{
                label: "dashboard1",
                content: <div>empty</div>
            }],data:[]}
        }
        return {data, dataTabs}
    },[dashboards])

    const [activeDashboardIndex, setActiveDashboardIndex] = useState<number>(0)

    const activeDashboardId = useMemo(()=>{
        if(tabs.data.length === 0) return undefined
        return tabs.data[activeDashboardIndex].data
    },[tabs, activeDashboardIndex])

    const {
        schema,
    } = useDashboardData(activeDashboardId)

    const {runtime, widgetsStore} = useDashboardRuntimeData()

    const load = useCallback(async() => {
        const data = await getActiveDashboardsCard()
        if(data)
            setDashboards(data) 
    },[getActiveDashboardsCard])

    useEffect(()=>{
        load()
    },[load])

    const tabHandler = useCallback((index:number) =>{
        if(tabs.data.length === 0)return
        setActiveDashboardIndex(index)
    },[tabs])

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <div className="home-page container-page">
                <Tabs tabs={tabs.dataTabs} onTabClick={tabHandler}/>
            </div>
            <div>
                <WidgetsStoreContext.Provider value={widgetsStore}>
                    <DashboardMainProvider
                        runtime={runtime}
                        schema={schema}
                    >
                        <div
                            style={{
                                display: "flex",
                                height: "100vh",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    transition: "margin-right 0.3s ease",
                                }}
                            >
                                <Dashboard schema={schema} />
                            </div>
                        </div>
                    </DashboardMainProvider>
                </WidgetsStoreContext.Provider>
            </div>
        </DashboardPageContext.Provider>
        
    )
}