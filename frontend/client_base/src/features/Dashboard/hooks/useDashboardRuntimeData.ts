import { useMemo } from "react"
import { useDashboardRuntime } from "./useDashboardRuntime"
import { WidgetStore } from "../helpers/widgetsStore"
import { createRuntime, IcreateRuntime } from "../helpers/dashboardRegistary"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useRoom } from "@src/features/Room"


export const useDashboardRuntimeData = () =>{

    const { devicesData } = useAppSelector(
        (state) => state.devices,
    )

    const { rooms } = useRoom()

    const widgetsStore = useMemo(
        () => new WidgetStore(),
        [],
    )

    const runtime = useMemo<IcreateRuntime>(
        () => createRuntime(widgetsStore),
        [widgetsStore],
    )

    useDashboardRuntime(
        runtime,
        devicesData,
        rooms,
    )

    return{
        runtime,
        widgetsStore

    }
}