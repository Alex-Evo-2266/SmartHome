import { DashboardSchema, NodeId, WidgetSchema } from "alex-evo-web-constructor";

export function removeWidget(
    schema: DashboardSchema,
    id: NodeId,
): DashboardSchema {
    const blocks = { ...schema.blocks };

    const removeFromTree = (parentId: NodeId): void => {
        const widget = blocks[parentId];

        if (!widget?.children) {
            return;
        }

        if (widget.children.includes(id)) {
            widget.children = widget.children.filter(
                childId => childId !== id,
            );
        }

        widget.children.forEach(removeFromTree);
    };

    // Удаляем из rootWidgets
    const rootWidgets = schema.rootWidgets.filter(
        widgetId => widgetId !== id,
    );

    // Удаляем ссылку на виджет у родителя
    Object.values(blocks).forEach(widget => {
        if (widget.children?.includes(id)) {
            widget.children = widget.children.filter(
                childId => childId !== id,
            );
        }
    });

    // Удаляем всё поддерево
    const removeSubtree = (nodeId: NodeId) => {
        const widget = blocks[nodeId];

        if (!widget) {
            return;
        }

        widget.children?.forEach(removeSubtree);

        delete blocks[nodeId];
    };

    removeSubtree(id);

    return {
        ...schema,
        blocks,
        rootWidgets,
    };
}

export function addWidget(
    schema: DashboardSchema,
    widget: WidgetSchema,
    options?: {
        parentId?: NodeId;
        index?: number;
    },
): DashboardSchema {
    const blocks = {
        ...schema.blocks,
        [widget.id]: widget,
    };

    const index = options?.index;

    // Добавление внутрь другого виджета
    if (options?.parentId) {
        const parent = blocks[options.parentId];

        if (!parent) {
            throw new Error(
                `Parent widget "${options.parentId}" not found`,
            );
        }

        const children = [...(parent.children ?? [])];

        if (index === undefined) {
            children.push(widget.id);
        } else {
            children.splice(index, 0, widget.id);
        }

        blocks[options.parentId] = {
            ...parent,
            children,
        };

        return {
            ...schema,
            blocks,
        };
    }

    // Добавление в root
    const rootWidgets = [...schema.rootWidgets];

    if (index === undefined) {
        rootWidgets.push(widget.id);
    } else {
        rootWidgets.splice(index, 0, widget.id);
    }

    return {
        ...schema,
        blocks,
        rootWidgets,
    };
}


export type MoveWidgetOptions = {
    parentId?: NodeId;
    index: number;
};

export function moveWidget(
    schema: DashboardSchema,
    widgetId: NodeId,
    options: MoveWidgetOptions,
): DashboardSchema {
    const blocks = { ...schema.blocks };

    // 1. Находим и удаляем widget из текущего места
    let rootWidgets = [...schema.rootWidgets];

    rootWidgets = rootWidgets.filter(
        id => id !== widgetId,
    );

    for (const [id, widget] of Object.entries(blocks)) {
        if (!widget.children?.includes(widgetId)) {
            continue;
        }

        blocks[id] = {
            ...widget,
            children: widget.children.filter(
                childId => childId !== widgetId,
            ),
        };
    }

    // 2. Вставляем в новое место
    if (options.parentId) {
        const parent = blocks[options.parentId];

        if (!parent) {
            throw new Error(
                `Parent widget "${options.parentId}" not found`,
            );
        }

        // Нельзя поместить элемент внутрь самого себя
        if (options.parentId === widgetId) {
            throw new Error(
                "Widget cannot be moved inside itself",
            );
        }

        const children = [...(parent.children ?? [])];

        children.splice(
            options.index,
            0,
            widgetId,
        );

        blocks[options.parentId] = {
            ...parent,
            children,
        };
    } else {
        rootWidgets.splice(
            options.index,
            0,
            widgetId,
        );
    }

    return {
        ...schema,
        blocks,
        rootWidgets,
    };
}