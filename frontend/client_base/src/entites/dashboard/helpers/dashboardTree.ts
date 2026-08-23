import type { DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import type { TreeNodeModel } from "alex-evo-tree"

export function widgetToTreeNode(
    schema: DashboardSchema,
    widget: WidgetSchema,
): TreeNodeModel {
    return {
        id: widget.id,
        title: widget.type,
        type: widget.type,
        data: widget.data,
        children: widget.children?.map((id) => {
            const child = schema.blocks[id]

            return child
                ? widgetToTreeNode(schema, child)
                : undefined
        }).filter(Boolean) as TreeNodeModel[] | undefined,
    }
}

export function dashboardToTree(
    schema: DashboardSchema,
): TreeNodeModel[] {
    return schema.rootWidgets
        .map((id) => schema.blocks[id])
        .filter(Boolean)
        .map((widget) => widgetToTreeNode(schema, widget))
}