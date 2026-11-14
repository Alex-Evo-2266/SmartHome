import { useCallback, useEffect, useState } from "react"

import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import type {
    Automation,
    DeviceCommand,
    EnableAutomationRequest,
    ExpressionCapabilitiesResponse,
    OperatorCategory,
    OperatorDefinition,
} from "../models/automation"

const AUTOMATION_URL = "/api-devices/automation-v4"

export const useAutomationAPI = () => {
    const { request, loading, error, clearError } = useHttp()
    const { showSnackbar } = useSnackbar()

    /**
     * Получить все сценарии.
     * Ожидаемый ответ: { data: Automation[] }
     */
    const getAutomationAll = useCallback(async (): Promise<Automation[]> => {
        const response: Automation[] =
            await request(AUTOMATION_URL)

        return response
    }, [request])

    /**
     * Получить сценарий по ID.
     */
    const getAutomation = useCallback(async (
        id: string,
    ): Promise<Automation> => {
        return await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}`,
            TypeRequest.GET,
            undefined,
            {},
            false,
            true,
        )
    }, [request])

    /**
     * Создать сценарий.
     */
    const addAutomation = useCallback(async (
        automation: Automation,
    ): Promise<Automation> => {
        return await request(
            AUTOMATION_URL,
            TypeRequest.POST,
            automation as unknown as Record<string, unknown>,
            {},
            false,
            true,
        )
    }, [request])

    /**
     * Изменить сценарий.
     */
    const editAutomation = useCallback(async (
        id: string,
        automation: Automation,
    ): Promise<Automation> => {
        return await request(
            `${AUTOMATION_URL}/${encodeURIComponent(id)}`,
            TypeRequest.PUT,
            automation as unknown as Record<string, unknown>,
            {},
            false,
            true,
        )
    }, [request])

    /**
     * Получить список доступных команд устройства.
     */
    const getActionCommands = useCallback(async (): Promise<DeviceCommand[]> => {
        const response: DeviceCommand[] = await request(
            `${AUTOMATION_URL}/action_commands`,
        )

        return response
    }, [request])

    /**
     * Получить описания поддерживаемых выражений.
     */
    const getExpressionCapabilities = useCallback(async (): Promise<ExpressionCapabilitiesResponse> => {
        const response: ExpressionCapabilitiesResponse = await request(
            `${AUTOMATION_URL}/expression-capabilities`,
        )

        return response
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
            body as unknown as Record<string, unknown>,
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
        getActionCommands,
        getExpressionCapabilities,
        deleteAutomation,
        enableAutomation,
        loading,
    }
}



export const useAutomationExpressionCapabilities = () => {

    const {getExpressionCapabilities} = useAutomationAPI()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [expressionCapabilities, setData] = useState<ExpressionCapabilitiesResponse>({
        functions:[],
        types: {},
        argument_types: {},
        operators: {} as Record<OperatorCategory, OperatorDefinition[]>
    })

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getExpressionCapabilities();

            setData(result as ExpressionCapabilitiesResponse);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить список блоков");
        } finally {
            setLoading(false);
        }
    }, [getExpressionCapabilities]);

    useEffect(() => {
        load();
    }, [load]);

    return{
        expressionCapabilities,
        loading,
        error
    }
}