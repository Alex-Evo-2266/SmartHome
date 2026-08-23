import { Button } from "alex-evo-sh-ui-kit"
import { TreeBuilder, TreeNodeModel } from "alex-evo-tree"

interface DashboardSidebarProps {
    items: TreeNodeModel[]
    onInsert: (parent: string | null, index: number) => void
    onEdit: (id: string) => void
    onEditLayout: () => void
    onSave: () => void
}

export const DashboardSidebar = ({
    items,
    onInsert,
    onEdit,
    onSave,
}: DashboardSidebarProps) => {

    const editLayout = () => {

    }

    return (
        <>
            <Button onClick={editLayout}>
                layout
            </Button>
            <TreeBuilder
                items={items}
                onInsert={onInsert}
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