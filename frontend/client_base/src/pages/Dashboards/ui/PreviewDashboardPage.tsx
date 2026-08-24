import {
    Dashboard,
    DashboardMainProvider,
} from "alex-evo-web-constructor"

import { useParams } from "react-router-dom"

import { useDashboardData } from "@src/entites/dashboard"
import { WidgetsStoreContext } from "@src/features/Dashboard/helpers/widgetsStore"
import { useDashboardRuntimeData } from "@src/features/Dashboard"
import { DashboardEditor } from "./DashboardEditor"

export const PreviewDashboardPage = () => {
    const { id } = useParams<{ id: string }>()

    const {
        schema,
        addWidget,
        editWidget,
        save,
        setSchema
    } = useDashboardData(id)

    const {runtime, widgetsStore} = useDashboardRuntimeData()

    return (
        <WidgetsStoreContext.Provider value={widgetsStore}>
            <DashboardMainProvider
                runtime={runtime}
                schema={schema}
            >
                <div
                    style={{
                        display: "flex",
                        height: "100vh",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            transition: "margin-right 0.3s ease",
                        }}
                    >
                        <Dashboard schema={schema} />
                    </div>

                    <DashboardEditor setSchema={setSchema} schema={schema} runtime={runtime} addWidget={addWidget} editWidget={editWidget} save={save}/>

                </div>
            </DashboardMainProvider>
        </WidgetsStoreContext.Provider>
    )
}