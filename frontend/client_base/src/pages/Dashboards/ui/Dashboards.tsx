import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from "react"
import { Card, FAB, GridLayout, GridLayoutItem, Plus, Search, TextDialog } from "alex-evo-sh-ui-kit"
import { v4 as uuidv4 } from 'uuid';

import { Dashboard, useDashboardAPI } from "@src/entites/dashboard"
import { DialogPortal } from "@src/shared"

export const DashboardsPage = () => {

    const {getDashboardsAll, createDashboard} = useDashboardAPI()
    const [search, setSearchQuery] = useState("")
    const [addDeviceDialogVisible, setAddDeviceDialogVisible] = useState(false)
    const [dashboards, setDashboards] = useState<Dashboard[]>([])
    const navigate = useNavigate()

    const loadDashboard = useCallback(async() => {
        const data = await getDashboardsAll()
        if(data)
            setDashboards(data)
    },[getDashboardsAll])

    const addDashboard = useCallback(async(name: string) => {
        await createDashboard({
            title: name,
            id: uuidv4(),
            cards:[],
            private: false
        })
        await loadDashboard()
    },[createDashboard])

    useEffect(()=>{
        loadDashboard()
    },[loadDashboard])

    const showAddDeviceDialog = () => {
        setAddDeviceDialogVisible(true)
    }

    const hideAddDeviceDialog = () => {
        setAddDeviceDialogVisible(false)
    }

    const openPreview = (id:string) => {
        navigate(`/dashboard/${id}`)
    }
    
    return(
        <div className="device-page container-page">
            <Search
                onSearch={data => setSearchQuery(data)}
            />
            <GridLayout className="device-container" itemMaxWith="300px" itemMinWith="200px">
            {
                dashboards.filter(item=>item.title.startsWith(search)).map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <Card header={`Dashboard: ${item.title}`} onClick={()=>openPreview(item.id)}></Card>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB className="base-fab" onClick={showAddDeviceDialog} icon={<Plus/>}/>
            {
                addDeviceDialogVisible &&
                <DialogPortal>
                    <TextDialog header="create dashboard" onHide={hideAddDeviceDialog} onSuccess={addDashboard}/>
                </DialogPortal>
            }
        </div>
    )
}
