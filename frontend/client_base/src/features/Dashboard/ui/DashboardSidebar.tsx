import { Button } from "alex-evo-sh-ui-kit"
import { MoveEvent, TreeBuilder, TreeNodeModel } from "alex-evo-tree"

interface DashboardSidebarProps {
    items: TreeNodeModel[]
    onInsert: (parent: string | null, index: number) => void
    onEdit: (id: string) => void
    onEditLayout: () => void
    onSave: () => void
    onMove: (event: MoveEvent) => void
}

export const DashboardSidebar = ({
    items,
    onInsert,
    onEdit,
    onSave,
    onEditLayout,
    onMove
}: DashboardSidebarProps) => {

    return (
        <>
            <Button onClick={onEditLayout}>
                layout
            </Button>
            <TreeBuilder
                items={items}
                onInsert={onInsert}
                onMove={onMove}
                renderNode={(node) => (
                    <div onClick={() => onEdit(node.id)}>
                        {node.title}
                    </div>
                )}
            />

            <Button onClick={onSave}>
                save
            </Button>
        </>
    )
}