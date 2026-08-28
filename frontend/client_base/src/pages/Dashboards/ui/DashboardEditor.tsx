import { Sidebar } from "@src/shared/ui/SideBar"
import { DashboardSidebar } from "@src/features/Dashboard"
import { Button, FAB, ToolsIcon } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo, useState } from "react"
import { dashboardToTree } from "@src/entites/dashboard"
import { DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import { IcreateRuntime } from "@src/features/Dashboard/helpers/dashboardRegistary"
import { DialogPortal } from "@src/shared"
import { AddWidgetgDialog } from "./dialogs/addWidgetDialog"
import { EditWidgetgDialog } from "./dialogs/editWidgetDialog"
import { LayoutConfigDialog } from "./dialogs/baseDialogLayout"
import { MoveEvent } from "alex-evo-tree"
import { moveWidget } from "@src/shared/lib/helpers/dashboardHelpers"

import './DashboardEditor.scss'

type DashboardEditorProps = {
    schema: DashboardSchema
    addWidget: (widget: WidgetSchema<Record<string, unknown>>, parent: string | null, index: number) => void
    editWidget: (widget: WidgetSchema<Record<string, unknown>>) => void
    runtime: IcreateRuntime
    save: ()=>void
    setSchema: React.Dispatch<React.SetStateAction<DashboardSchema>>
}

export const DashboardEditor = ({schema, addWidget, editWidget, runtime, save, setSchema}:DashboardEditorProps) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [addDialog, setAddDialog] = useState<{
        parent: string | null
        index: number
    } | null>(null)

    const [editWidgetId, setEditWidgetId] = useState<string | null>(null)
    const [editLayout, setEditLayout] = useState(false)

    const treeItems = useMemo(
        () => dashboardToTree(schema),
        [schema],
    )

    const editingWidget = editWidgetId
        ? schema.blocks[editWidgetId]
        : null

    const handleAddWidget = useCallback(
        (widget: Parameters<typeof addWidget>[0]) => {
            if (!addDialog) {
                return
            }

            addWidget(
                widget,
                addDialog.parent,
                addDialog.index
            )

            setAddDialog(null)
        },
        [addDialog, addWidget],
    )


    const handleEditWidget = useCallback(
        (widget: Parameters<typeof editWidget>[0]) => {
            if (!editWidgetId) {
                return
            }

            editWidget(
                widget
            )

            setEditWidgetId(null)
        },
        [editWidgetId, editWidget],
    )

    const handleEditLayout = useCallback((typeLayout: string)=>{
        setSchema(prev=>({...prev, layout:typeLayout}))
    },[])

    const moveHandler = (event: MoveEvent) => {
        console.log(event)

        setSchema(prev=>moveWidget(prev, event.sourceId, {
            index: event.index,
            parentId: event.parentId ?? undefined
        }))
    }

    return(
        <>
            <FAB
                icon={<ToolsIcon />}
                onClick={() => setIsSidebarOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                className="dashboard-editor-sidebar"
                footer={
                    <Button style={{width:"100%"}} styleType="filledTotal" onClick={save}>save</Button>
                }
            >
                <DashboardSidebar
                    items={treeItems}
                    onInsert={(parent, index) => {
                        setAddDialog({
                            parent,
                            index,
                        })
                    }}
                    onEdit={setEditWidgetId}
                    onEditLayout={()=>setEditLayout(true)}
                    onMove={moveHandler}
                />
            </Sidebar>

            {addDialog && (
                <DialogPortal>
                    <AddWidgetgDialog
                        runtime={runtime}
                        onHide={() => setAddDialog(null)}
                        onSave={handleAddWidget}
                    />
                </DialogPortal>
            )}

            {editingWidget && (
                <DialogPortal>
                    <EditWidgetgDialog
                        data={editingWidget}
                        runtime={runtime}
                        onHide={() => setEditWidgetId(null)}
                        onSave={handleEditWidget}
                    />
                </DialogPortal>
            )}
                    
                    
            {editLayout && (
                <DialogPortal>
                    <LayoutConfigDialog 
                        runtime={runtime}
                        data={schema.layout}
                        onHide={()=>setEditLayout(false)}
                        onSave={handleEditLayout}
                    />
                </DialogPortal>
                )
            }
        </>

    )
}