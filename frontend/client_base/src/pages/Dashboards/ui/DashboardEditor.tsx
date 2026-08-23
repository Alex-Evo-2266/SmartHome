import { Sidebar } from "@src/shared/ui/SideBar"
import { DashboardSidebar } from "@src/features/Dashboard"
import { FAB, ToolsIcon } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo, useState } from "react"
import { dashboardToTree } from "@src/entites/dashboard"
import { DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import { IcreateRuntime } from "@src/features/Dashboard/helpers/dashboardRegistary"
import { DialogPortal } from "@src/shared"
import { AddWidgetgDialog } from "./dialogs/addWidgetDialog"
import { EditWidgetgDialog } from "./dialogs/editWidgetDialog"

type DashboardEditorProps = {
    schema: DashboardSchema
    addWidget: (widget: WidgetSchema<Record<string, unknown>>, parent: string | null, index: number) => void
    editWidget: (widget: WidgetSchema<Record<string, unknown>>) => void
    runtime: IcreateRuntime
    save: ()=>void
}

export const DashboardEditor = ({schema, addWidget, editWidget, runtime, save}:DashboardEditorProps) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [addDialog, setAddDialog] = useState<{
        parent: string | null
        index: number
    } | null>(null)

    const [editWidgetId, setEditWidgetId] = useState<string | null>(null)

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

    const handleEditLayout = useCallback(()=>{

    },[])

    return(
        <>
            <FAB
                icon={<ToolsIcon />}
                onClick={() => setIsSidebarOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
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
                    onEditLayout={handleEditLayout}
                    onSave={save}
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
        </>

    )
}