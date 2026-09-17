import { DashboardTreeNode } from "@src/shared/ui/TreeBuilderNode/TreeBuilderNode"
import { Button } from "alex-evo-sh-ui-kit"
import { MoveEvent, TreeBuilder, TreeNodeModel } from "alex-evo-tree"

interface DashboardSidebarProps {
    items: TreeNodeModel[]
    onInsert: (parent: string | null, index: number) => void
    onEdit: (id: string) => void
    onEditLayout: () => void
    onDelete: (id: string) => void
    onMove: (event: MoveEvent) => void
}

export const DashboardSidebar = ({
    items,
    onInsert,
    onEdit,
    onEditLayout,
    onMove,
    onDelete
}: DashboardSidebarProps) => {

    return (
        <>
            <TreeBuilder
                items={items}
                onInsert={onInsert}
                onMove={onMove}
                onDelete={onDelete}
                renderNode={(node, drag) => (
                    <DashboardTreeNode
                        drag={drag}
                        node={node}
                        // selected={node.id === selectedId}
                        onClick={() => onEdit(node.id)}
                    />
                )}
            />

            <Button onClick={onEditLayout}>
                layout
            </Button>
        </>
    )
}