
import { Dashboard, DashboardMainProvider, useData, WidgetSchema, type DashboardSchema } from "alex-evo-web-constructor"
import { FAB, ToolsIcon } from "alex-evo-sh-ui-kit"
import { createRuntime, IcreateRuntime } from "../helpers/dashboardRegistary"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Sidebar } from "@src/shared/ui/SideBar"
import { TreeBuilder, TreeNodeModel } from "alex-evo-tree"
import { DialogPortal } from "@src/shared"
import { WidgetsStoreContext, WidgetStore } from "../helpers/widgetsStore"
import { AddWidgetgDialog } from "./dialogs/addWidgetDialog"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useRoom } from "@src/features/Room"
import { TypeDeviceField } from "@src/entites/devices"


export const PreviewDashboardPage = () => {

    const [schema] = useState<DashboardSchema>({
        version: "1",
        blocks: {},
        rootWidgets: [],
        layout: "waterfall"
    }) 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [dialogVisible, setDialogVisible] = useState<{parent: null | string, index: number} | null>(null)

    const widgetsStore = useMemo(()=>new WidgetStore(),[]) 
    const { devicesData } = useAppSelector((state) => state.devices);
    const {rooms} = useRoom()

    const runtime = useMemo<IcreateRuntime>(()=>createRuntime(widgetsStore),[widgetsStore])
    
    const getValueRoomDevice = useCallback((devices:{system_name: string, id_field_device:string}[], type: TypeDeviceField)=>{
        
        const conds = devicesData.filter(dev=>devices.map(item=>item.system_name).includes(dev.system_name))
        const conds_field = conds
                                .map(dev=>dev.fields)
                                ?.filter(fields=>!!fields && fields
                                    .filter(field=>devices
                                        .map(item=>item.id_field_device)
                                        .includes(field.id)
                                    )
                                )
                                .flat()
                                .filter(item=>item !== undefined)
        if(type === TypeDeviceField.TEXT || type === TypeDeviceField.BASE || type === TypeDeviceField.ENUM)
            return conds_field.length === 0? "": conds_field[0].value ?? ""
        if(type === TypeDeviceField.BINARY){
            return conds_field.some(item=>item.value && ["true", true, 1, "1"].includes(item.value))
        }
        if(type === TypeDeviceField.NUMBER || type === TypeDeviceField.COUNTER){
           return Math.max(...conds_field.map(item=>Number(item.value)).filter(item=>!Number.isNaN(item))) 
        }


    },[devicesData])

    useEffect(()=>{
        console.log("rooms", rooms)
        rooms.forEach((item)=>{
            for(let key in item.device_room){
                for(let field_key in item.device_room[key].fields){
                    const val = getValueRoomDevice(item.device_room[key].fields[field_key].devices, item.device_room[key].fields[field_key].field_type)
                    runtime.store.set(`rooms.${item.name_room}.${key}.${field_key}`, val)
                }
            }
        })
        devicesData.forEach(dev=>{
            dev.fields?.forEach(field=>{
                runtime.store.set(`devices.${dev.system_name}.${field.id}`, field.value)
            })
        })
    },[devicesData, rooms, getValueRoomDevice])

    const showTool = () =>{
        setIsSidebarOpen(true)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    function f1(schema: DashboardSchema, block: WidgetSchema):TreeNodeModel{
        return {
            id: block.id,
            title: block.type,
            type: block.type,
            data: block.data,
            children: block.children ? block.children.map((item)=>f1(schema, schema.blocks[item])) : []
        }
    }

    function convertForTree(schema: DashboardSchema):TreeNodeModel[]{
        return schema.rootWidgets.map((item)=>f1(schema, schema.blocks[item]))
    }

    return(
        <WidgetsStoreContext.Provider value={widgetsStore}>
            <DashboardMainProvider
                runtime={runtime}
                schema={schema}
            >
            <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
                <div style={{ 
                    flex: 1, 
                    transition: 'margin-right 0.3s ease',
                }}>
                

                        <Dashboard
                            schema={schema}
                        />
                </div>

                <FAB icon={<ToolsIcon/>} onClick={showTool}/>
                {/* Боковая панель */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
                    <TreeBuilder onInsert={(parent, index)=>setDialogVisible({parent, index})} items={convertForTree(schema)} renderNode={(node)=>(<div>{node.title}</div>)}/>
                </Sidebar>

                {
                    !!dialogVisible && <DialogPortal>
                        <AddWidgetgDialog runtime={runtime} onHide={()=>setDialogVisible(null)}/>
                    </DialogPortal>
                }
                
            </div>
            </DashboardMainProvider>
        </WidgetsStoreContext.Provider>
    )
}