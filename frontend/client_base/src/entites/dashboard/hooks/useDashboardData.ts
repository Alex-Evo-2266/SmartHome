import { useCallback, useEffect, useState } from "react"
import type { DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import { useDashboardAPI } from "../api/dashboardAPI"

export interface DashboardData {
    id: string
    title: string
    private: boolean
}

const emptyDashboard: DashboardData = {
    id: "",
    title: "",
    private: false,
}

const emptySchema: DashboardSchema = {
    version: "1",
    blocks: {},
    rootWidgets: [],
    layout: "waterfall",
}

export const useDashboardData = (id?: string) => {
    const {
        getDashboard,
        updateDashboard,
    } = useDashboardAPI()

    const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard)
    const [schema, setSchema] = useState<DashboardSchema>(emptySchema)
    const [loading, setLoading] = useState(false)

    const loadDashboard = useCallback(async () => {
        if (!id) {
            return
        }

        setLoading(true)

        try {
            const data = await getDashboard(id)

            setDashboard(data)
            setSchema(data.schema)
        } finally {
            setLoading(false)
        }
    }, [getDashboard, id])

    useEffect(() => {
        loadDashboard()
    }, [loadDashboard])

    const addWidget = useCallback(
        (
            widget: WidgetSchema,
            parent: string | null,
            index: number,
        ) => {
            setSchema((prev) => {
                const blocks = {
                    ...prev.blocks,
                    [widget.id]: widget,
                }

                if (parent === null) {
                    const rootWidgets = [...prev.rootWidgets]

                    rootWidgets.splice(index, 0, widget.id)

                    return {
                        ...prev,
                        blocks,
                        rootWidgets,
                    }
                }

                const parentBlock = prev.blocks[parent]

                if (!parentBlock) {
                    return prev
                }

                const children = [...(parentBlock.children ?? [])]

                children.splice(index, 0, widget.id)

                return {
                    ...prev,
                    blocks: {
                        ...blocks,
                        [parent]: {
                            ...parentBlock,
                            children,
                        },
                    },
                }
            })
        },
        [],
    )

    const editWidget = useCallback((widget: WidgetSchema) => {
        setSchema((prev) => ({
            ...prev,
            blocks: {
                ...prev.blocks,
                [widget.id]: widget,
            },
        }))
    }, [])

    const save = useCallback(async () => {
        if (!id) {
            return
        }

        await updateDashboard(id, {
            ...dashboard,
            schema,
        })
    }, [
        id,
        dashboard,
        schema,
        updateDashboard,
    ])

    return {
        dashboard,
        schema,
        loading,

        setSchema,

        addWidget,
        editWidget,
        save,
        reload: loadDashboard,
    }
}