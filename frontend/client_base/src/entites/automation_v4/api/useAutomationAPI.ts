import { useCallback, useEffect } from "react"

import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"

import type {
    Automation,
    AutomationListResponse,
    EnableAutomationRequest,
} from "../models/automation"

const AUTOMATION_URL = "/api-devices/automation"

export const useAutomationAPI = () => {
    const { request, loading, error, clearError } = useHttp()
    const { showSnackbar } = useSnackbar()

    /**
     * Получить все сценарии.
     * Ожидаемый ответ: { data: Automation[] }
     */
    const getAutomationAll = useCallback(async (): Promise<Automation[]> => {
        const response: AutomationListResponse =
            await request(AUTOMATION_URL)

        return response.data
    }, [request])

    /**
     * Получить сценарий по ID.
     */
    const getAutomation = useCallback(async (
        id: string,
    ): Promise<Automation> => {
        return await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}`,
        )
    }, [request])

    /**
     * Создать сценарий.
     */
    const addAutomation = useCallback(async (
        automation: Automation,
    ): Promise<void> => {
        await request(
            AUTOMATION_URL,
            TypeRequest.POST,
            automation as any,
        )
    }, [request])

    /**
     * Изменить сценарий.
     */
    const editAutomation = useCallback(async (
        id: string,
        automation: Automation,
    ): Promise<void> => {
        await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}`,
            TypeRequest.PUT,
            automation as any,
        )
    }, [request])

    /**
     * Удалить сценарий.
     */
    const deleteAutomation = useCallback(async (
        id: string,
    ): Promise<void> => {
        await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}`,
            TypeRequest.DELETE,
        )
    }, [request])

    /**
     * Включить или выключить сценарий.
     */
    const enableAutomation = useCallback(async (
        id: string,
        enabled: boolean,
    ): Promise<void> => {
        const body: EnableAutomationRequest = {
            is_enabled: enabled,
        }

        await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}/enable`,
            TypeRequest.PATCH,
            body as any,
        )
    }, [request])

    useEffect(() => {
        if (error) {
            showSnackbar(error, {}, 10000)
        }

        return () => {
            clearError()
        }
    }, [error, clearError, showSnackbar])

    return {
        getAutomationAll,
        getAutomation,
        addAutomation,
        editAutomation,
        deleteAutomation,
        enableAutomation,
        loading,
    }
}