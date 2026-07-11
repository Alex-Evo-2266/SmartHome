
import { Dashboard, DashboardMainProvider, WidgetSchema, type DashboardSchema } from "alex-evo-web-constructor"
import { FAB, ToolsIcon } from "alex-evo-sh-ui-kit"
import { createRuntime } from "../helpers/dashboardRegistary"
import { useMemo, useState } from "react"
import { Sidebar } from "@src/shared/ui/SideBar"
import { TreeBuilder, TreeNodeModel } from "alex-evo-tree"
import { DialogPortal } from "@src/shared"
import { WidgetsStoreContext, WidgetStore } from "../helpers/widgetsStore"
import { AddWidgetgDialog } from "./dialogs/addWidgetDialog"


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
    const runtime = useMemo(()=>createRuntime(widgetsStore),[widgetsStore]) 

    const showTool = () =>{
        setIsSidebarOpen(true)
    }

    const addCard = (event: any) => {
        console.log(event)
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
            <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
                <div style={{ 
                    flex: 1, 
                    transition: 'margin-right 0.3s ease',
                }}>
                
                    <DashboardMainProvider
                        runtime={runtime}
                        schema={schema}
                    >
                        <Dashboard
                            schema={schema}
                        />
                    </DashboardMainProvider>
                </div>

                <FAB icon={<ToolsIcon/>} onClick={showTool}/>
                {/* Боковая панель */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
                    <TreeBuilder onInsert={(parent, index)=>setDialogVisible({parent, index})} items={convertForTree(schema)} renderNode={(node)=>(<div>{node.title}</div>)}/>
                </Sidebar>

                {
                    !!dialogVisible && <DialogPortal>
                        <AddWidgetgDialog onHide={()=>setDialogVisible(null)}/>
                    </DialogPortal>
                }
                
            </div>
        </WidgetsStoreContext.Provider>
    )
}