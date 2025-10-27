import { Dashboard, useDashboardAPI } from "@src/entites/dashboard"
import { DialogPortal } from "@src/shared"
import { ArrowUp, FAB, IColumn, IconButton, IDataItem, Plus, ScreenSize, Search, Table, TextDialog, ToolsIcon, Trash, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const DashboardsPage = () => {

    const {getDashboardsAllType, createDashboard, setUserDashboard} = useDashboardAPI()
    const [search, setSearchQuery] = useState("")
    const [addDeviceDialogVisible, setAddDeviceDialogVisible] = useState(false)
    const [dashboards, setDashboards] = useState<Dashboard[]>([])
    const [userDashboards, setUserDashboards] = useState<Dashboard[]>([])
    const data = useMemo<IDataItem[]>(()=>{
        return [
            {
                __all__:{
                    content: <Typography type="heading">Active dashboards</Typography>
                }
            },
            ...userDashboards.filter(item=>item.title.startsWith(search)).map(item=>({
                title: item.title,
                id: item.id,
                included: "true"
            })),
            {
                __all__:{
                    content: <Typography type="heading">Other dashboards</Typography>
                }
            },
            ...dashboards.filter(item=>item.title.startsWith(search) && !userDashboards.map(i=>i.id).includes(item.id)).map(item=>({
                title: item.title,
                id: item.id,
                included: userDashboards.map(i=>i.id).includes(item.id)?"true":"false"
            }))]
    },[dashboards, userDashboards, search])

    const navigate = useNavigate()

    const loadDashboard = useCallback(async() => {
        const data = await getDashboardsAllType()
        if(data)
        {
            setDashboards(data[0])
            setUserDashboards(data[1])
        }
    },[getDashboardsAllType])

    const addDashboard = useCallback(async(name: string) => {
        await createDashboard({
            title: name,
            id: uuidv4(),
            cards:[],
            private: false
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
        const data = [...(userDashboards.map(i=>i.id)), id]
        await setUserDashboard(data)
        loadDashboard()
    },[setUserDashboard, userDashboards, loadDashboard])

    const deleteUserDashboards = useCallback(async(id: string) => {
        const data = userDashboards.map(i=>i.id).filter(i=>i!==id)
        await setUserDashboard(data)
        loadDashboard()
    },[setUserDashboard, userDashboards, loadDashboard])

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
