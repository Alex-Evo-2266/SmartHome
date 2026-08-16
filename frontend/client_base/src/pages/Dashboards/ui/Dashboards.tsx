import { Dashboard, useDashboardAPI } from "@src/entites/dashboard"
import { DialogPortal } from "@src/shared"
import { ArrowUp, FAB, IColumn, IconButton, IDataItem, Plus, ScreenSize, Search, Table, TextDialog, ToolsIcon, Trash, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function sortDeshboard(dashboards: Dashboard[], activeDashboards: {id:string, title: string}[]){
    const ids = activeDashboards.map(item=>item.id)
    return dashboards.reduce((acc, item)=>{
        if(ids.includes(item.id)){
            acc[0].push(item)
        }else{
            acc[1].push(item)
        }
        return acc
    },[[],[]] as [Dashboard[],Dashboard[]])
}

export const DashboardsPage = () => {

    const {getDashboardsAll, createDashboard, getActiveDashboardsCard, activateDashboardCard, deactivateDashboardsCard} = useDashboardAPI()
    const [search, setSearchQuery] = useState("")
    const [addDeviceDialogVisible, setAddDeviceDialogVisible] = useState(false)
    const [dashboards, setDashboards] = useState<Dashboard[]>([])
    const [activeDashboards, setActiveDashboards] = useState<{id:string, title: string}[]>([])
    const data = useMemo<IDataItem[]>(()=>{
        const dsortDashboards = sortDeshboard(dashboards, activeDashboards)
        return [
            {
                __all__:{
                    content: <Typography type="heading">Active dashboards</Typography>
                }
            },
            ...dsortDashboards[0].filter(item=>item.title.startsWith(search)).map(item=>({
                title: item.title,
                id: item.id,
                included: "true"
            })),
            {
                __all__:{
                    content: <Typography type="heading">Other dashboards</Typography>
                }
            },
            ...dsortDashboards[1].filter(item=>item.title.startsWith(search) && !activeDashboards.map(i=>i.id).includes(item.id)).map(item=>({
                title: item.title,
                id: item.id,
                included: activeDashboards.map(i=>i.id).includes(item.id)?"true":"false"
            }))]
    },[dashboards, activeDashboards, search])

    const navigate = useNavigate()

    const loadDashboard = useCallback(async() => {
        const data2 = await getActiveDashboardsCard()
        if(data2)
        {
            setActiveDashboards(data2)
        }

        const data = await getDashboardsAll()
        if(data)
        {
            setDashboards(data)
        }
    },[getDashboardsAll])

    const addDashboard = useCallback(async(name: string) => {
        await createDashboard({
            title: name,
            id: uuidv4(),
            private: false,
            schema:{
                version: "1",
                layout: "base",
                blocks:{},
                rootWidgets:[]
            }
        })
        await loadDashboard()
    },[createDashboard, loadDashboard])

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

    const addUserDashboards = useCallback(async(id: string) => {
        await activateDashboardCard(id)
        await loadDashboard()
    },[loadDashboard])

    const deleteUserDashboards = useCallback(async(id: string) => {
        await deactivateDashboardsCard(id)
        await loadDashboard()
    },[loadDashboard])

    const columns:IColumn[] = [
        {
            title: "name",
            field: "title"
        },
        {
            title: "control",
            field: "control",
            template: (_, data)=>(
                <div>
                    {
                        data.included === "true"?
                        <IconButton icon={<Trash/>} onClick={()=>deleteUserDashboards(data.id as string)}/>:
                        <IconButton icon={<ArrowUp/>} onClick={()=>addUserDashboards(data.id as string)}/>
                    }
                    <IconButton icon={<ToolsIcon/>} onClick={()=>openPreview(data.id as string)}/>
                </div>
            )
        }
    ]

    return(
        <div className="device-page container-page">
            <Search
                onSearch={data => setSearchQuery(data)}
            />
            <div style={{marginBlockStart: "10px"}}>
                <Table columns={columns} data={data} screenSize={ScreenSize.STANDART}/>
            </div>
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
