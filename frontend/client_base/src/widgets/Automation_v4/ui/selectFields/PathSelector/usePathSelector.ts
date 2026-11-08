
import type { ExpressionValueType } from "@src/entites/automation_v4"
import {
    ObjectMap,
    ObjectNode
} from "@src/shared/lib/object-map/types"
import { useCallback, useMemo } from "react"

export interface PathSelectorLevel {
    index: number
    path: string
    value: string
    items: string[]
}

interface UsePathSelectorProps {
    objectMap: ObjectMap
    value?: string
    maxDepth?: number
    minDepth?: number
    allowedValueTypes?: readonly ExpressionValueType[]
}

interface UsePathSelectorResult {
    segments: string[]
    path: string
    levels: PathSelectorLevel[]
    rootItems: string[]
    currentNode?: ObjectNode
    canContinue: boolean
    isValid: boolean
    relativeDepth: number
    updateSegment: (
        index: number,
        selected: string
    ) => string[]
}

/**
 * Проверяет, может ли узел содержать
 * значение одного из разрешённых типов.
 */
export const isNodeAllowedByTypes = (
    node: ObjectNode,
    allowedValueTypes?: readonly ExpressionValueType[]
): boolean => {
    if (allowedValueTypes === undefined) {
        return true
    }

    if (allowedValueTypes.length === 0) {
        return false
    }

    if (
        node.meta?.kind === "field" ||
        node.meta?.kind === "variable"
    ) {
        return (
            node.meta.valueType !== undefined &&
            allowedValueTypes.includes(node.meta.valueType)
        )
    }

    return Object.values(node.children ?? {}).some(child =>
        isNodeAllowedByTypes(child, allowedValueTypes)
    )
}

/**
 * Получение узла по полному пути.
 */
const getObjectNode = (
    objectMap: ObjectMap,
    path: string
): ObjectNode | undefined => {
    const segments = path.split(".").filter(Boolean)

    if (!segments.length) {
        return undefined
    }

    let currentNode: ObjectNode | undefined

    for (const segment of segments) {
        const children = currentNode
            ? currentNode.children
            : objectMap

        currentNode = children?.[segment]

        if (!currentNode) {
            return undefined
        }
    }

    return currentNode
}

/**
 * Получение доступных дочерних элементов.
 */
const getAllowedChildren = (
    node: ObjectNode | undefined,
    allowedValueTypes?: readonly ExpressionValueType[]
): string[] => {
    if (!node?.children) {
        return []
    }

    return Object.entries(node.children)
        .filter(([, child]) =>
            isNodeAllowedByTypes(child, allowedValueTypes)
        )
        .map(([name]) => name)
}

export const usePathSelector = ({
    objectMap,
    value,
    maxDepth,
    minDepth,
    allowedValueTypes
}: UsePathSelectorProps): UsePathSelectorResult => {

    /**
     * Разбиваем входной путь на сегменты.
     */
    const requestedSegments = useMemo(
        () => (value ?? "").split(".").filter(Boolean),
        [value]
    )

    /**
     * Корневые элементы.
     *
     * Отображаются даже тогда, когда путь пустой.
     */
    const rootItems = useMemo(
        () =>
            Object.entries(objectMap)
                .filter(([, node]) =>
                    isNodeAllowedByTypes(node, allowedValueTypes)
                )
                .map(([name]) => name),
        [objectMap, allowedValueTypes]
    )

    /**
     * Получаем существующую часть пути.
     *
     * Если сегмент отсутствует в objectMap,
     * дальнейшие сегменты отбрасываются.
     */
    const segments = useMemo(() => {
        const result: string[] = []

        let currentChildren: Record<string, ObjectNode> = objectMap

        const depthLimit = maxDepth ?? Infinity

        for (const segment of requestedSegments) {
            if (result.length >= depthLimit) {
                break
            }

            const node = currentChildren[segment]

            if (!node) {
                break
            }

            result.push(segment)

            currentChildren = node.children ?? {}
        }

        return result
    }, [
        objectMap,
        requestedSegments,
        maxDepth
    ])

    const path = segments.join(".")

    /**
     * Текущий узел выбранного пути.
     */
    const currentNode = useMemo(
        () => getObjectNode(objectMap, path),
        [objectMap, path]
    )

    const relativeDepth = segments.length

    /**
     * Строим Select для каждого выбранного сегмента.
     */
    const levels = useMemo<PathSelectorLevel[]>(() => {
        const result: PathSelectorLevel[] = []

        let parentNode: ObjectNode | undefined

        for (let index = 0; index < segments.length; index++) {
            const selected = segments[index]

            const children = parentNode
                ? parentNode.children
                : objectMap

            const items = Object.entries(children ?? {})
                .filter(([, node]) =>
                    isNodeAllowedByTypes(node, allowedValueTypes)
                )
                .map(([name]) => name)

            /**
             * Не теряем уже выбранное значение,
             * если оно больше не проходит фильтрацию.
             */
            if (!items.includes(selected)) {
                items.push(selected)
            }

            result.push({
                index,
                path: segments.slice(0, index).join("."),
                value: selected,
                items
            })

            parentNode = children?.[selected]
        }

        return result
    }, [
        objectMap,
        segments,
        allowedValueTypes
    ])

    /**
     * Проверяем типы всех выбранных узлов.
     *
     * Тип проверяется для конечного поля,
     * а промежуточные объекты проверяются
     * на наличие подходящих дочерних элементов.
     */
    const typesValid = useMemo(() => {
        if (allowedValueTypes === undefined) {
            return true
        }

        if (allowedValueTypes.length === 0) {
            return false
        }

        if (segments.length === 0) {
            return false
        }

        const lastNode = getObjectNode(
            objectMap,
            path
        )

        if (!lastNode) {
            return false
        }

        if (
            lastNode.meta?.kind === "field" ||
            lastNode.meta?.kind === "variable"
        ) {
            return (
                lastNode.meta.valueType !== undefined &&
                allowedValueTypes.includes(lastNode.meta.valueType)
            )
        }

        return isNodeAllowedByTypes(
            lastNode,
            allowedValueTypes
        )
    }, [
        objectMap,
        segments,
        path,
        allowedValueTypes
    ])

    const depthValid =
        relativeDepth >= (minDepth ?? 0) &&
        relativeDepth <= (maxDepth ?? Infinity)

    const isValid =
        !!currentNode &&
        depthValid &&
        typesValid

    /**
     * Можно ли продолжить выбор пути.
     */
    const canContinue =
        !!currentNode &&
        relativeDepth < (maxDepth ?? Infinity) &&
        getAllowedChildren(
            currentNode,
            allowedValueTypes
        ).length > 0

    /**
     * Изменение сегмента.
     *
     * Все сегменты после изменённого удаляются.
     */
    const updateSegment = useCallback(
        (index: number, selected: string): string[] => {
            return [
                ...segments.slice(0, index),
                selected
            ]
        },
        [segments]
    )

    return {
        segments,
        path,
        levels,
        rootItems,
        currentNode,
        canContinue,
        isValid,
        relativeDepth,
        updateSegment
    }
}
