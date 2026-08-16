import { TypeRequest } from "@src/shared/api/type"
import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"

import {
    Dashboard,
    Dashboards,
} from "../models/panel"


export const useDashboardAPI = () => {

    const {
        request,
        loading,
        error,
        clearError,
    } = useHttp()

    const { showSnackbar } = useSnackbar()


    // =========================================================
    // USER / AVAILABLE DASHBOARDS
    // =========================================================

    /**
     * Получить все dashboard,
     * доступные текущему пользователю.
     *
     * Backend сам объединяет:
     *
     * global/*
     * users/{user_id}/*
     *
     * Пользовательские dashboard имеют приоритет.
     */
    const getDashboardsAll = useCallback(async () => {

        const data: Dashboards = await request(
            `/api-pages/dashboard`,
            TypeRequest.GET,
        )

        if (!data)
            return

        return data.dashboards

    }, [request])


    /**
     * Получить dashboard.
     *
     * Backend сначала ищет:
     *
     * users/{user_id}/{id}.yml
     *
     * затем:
     *
     * global/{id}.yml
     */
    const getDashboard = useCallback(
        async (id: string) => {

            const data: Dashboard = await request(
                `/api-pages/dashboard/${id}`,
                TypeRequest.GET,
            )

            return data

        },
        [request],
    )


    /**
     * Создать пользовательский dashboard.
     */
    const createDashboard = useCallback(
        async (data: Dashboard) => {

            const result: Dashboard = await request(
                `/api-pages/dashboard`,
                TypeRequest.POST,
                {...data},
            )

            return result

        },
        [request],
    )


    /**
     * Обновить пользовательский dashboard.
     *
     * Если dashboard существует только глобально,
     * backend создаст пользовательский override.
     */
    const updateDashboard = useCallback(
        async (
            id: string,
            data: Dashboard,
        ) => {

            const result: Dashboard = await request(
                `/api-pages/dashboard/${id}`,
                TypeRequest.PUT,
                {...data},
            )

            return result

        },
        [request],
    )


    /**
     * Удалить пользовательскую версию dashboard.
     *
     * Если существует global/{id}.yml,
     * после удаления снова будет доступен глобальный dashboard.
     */
    const deleteDashboard = useCallback(
        async (id: string) => {

            await request(
                `/api-pages/dashboard/${id}`,
                TypeRequest.DELETE,
            )

        },
        [request],
    )


    // =========================================================
    // GLOBAL DASHBOARDS
    // =========================================================

    /**
     * Получить список глобальных dashboard.
     */
    const getGlobalDashboards = useCallback(
        async () => {

            const data: Dashboards = await request(
                `/api-pages/dashboard/global/list`,
                TypeRequest.GET,
            )

            if (!data)
                return

            return data.dashboards

        },
        [request],
    )


    /**
     * Получить глобальный dashboard напрямую.
     *
     * В отличие от getDashboard()
     * здесь НЕ происходит fallback на пользовательский.
     */
    const getGlobalDashboard = useCallback(
        async (id: string) => {

            const data: Dashboard = await request(
                `/api-pages/dashboard/global/${id}`,
                TypeRequest.GET,
            )

            return data

        },
        [request],
    )


    /**
     * Создать глобальный dashboard.
     *
     * Требует admin privilege на backend.
     */
    const createGlobalDashboard = useCallback(
        async (data: Dashboard) => {

            const result: Dashboard = await request(
                `/api-pages/dashboard/global`,
                TypeRequest.POST,
                {...data},
            )

            return result

        },
        [request],
    )


    /**
     * Обновить глобальный dashboard.
     */
    const updateGlobalDashboard = useCallback(
        async (
            id: string,
            data: Dashboard,
        ) => {

            const result: Dashboard = await request(
                `/api-pages/dashboard/global/${id}`,
                TypeRequest.PUT,
                {...data},
            )

            return result

        },
        [request],
    )


    /**
     * Удалить глобальный dashboard.
     */
    const deleteGlobalDashboard = useCallback(
        async (id: string) => {

            await request(
                `/api-pages/dashboard/global/${id}`,
                TypeRequest.DELETE,
            )

        },
        [request],
    )


    /**
     * Получить список активных dashboard.
     */
    const getActiveDashboardsCard = useCallback(
        async () => {

            const data: {dashboards: {id:string, title: string}[]} = await request(
                `/api-pages/dashboard/active`,
                TypeRequest.GET,
            )

            if (!data)
                return

            return data.dashboards

        },
        [request],
    )

    /**
     * Получить список активных dashboard.
     */
    const activateDashboardCard = useCallback(
        async (dashboard_id:string) => {

            const data: Dashboards = await request(
                `/api-pages/dashboard/${dashboard_id}/activate`,
                TypeRequest.POST,
            )

            if (!data)
                return

            return data

        },
        [request],
    )

    /**
     * Получить список активных dashboard.
     */
    const deactivateDashboardsCard = useCallback(
        async (dashboard_id:string) => {

            const data: Dashboards = await request(
                `/api-pages/dashboard/${dashboard_id}/activate`,
                TypeRequest.DELETE,
            )

            if (!data)
                return

            return data

        },
        [request],
    )


    // =========================================================
    // ERROR
    // =========================================================

    useEffect(() => {

        if (error) {
            showSnackbar(
                error,
                {},
                10000,
            )
        }

        return () => {
            clearError()
        }

    }, [
        error,
        clearError,
        showSnackbar,
    ])







    // =========================================================
    // RETURN
    // =========================================================

    return {
        // User / available
        getDashboardsAll,
        getDashboard,
        createDashboard,
        updateDashboard,
        deleteDashboard,

        // Global
        getGlobalDashboards,
        getGlobalDashboard,
        createGlobalDashboard,
        updateGlobalDashboard,
        deleteGlobalDashboard,

        getActiveDashboardsCard,
        activateDashboardCard,
        deactivateDashboardsCard,

        loading,
    }
}