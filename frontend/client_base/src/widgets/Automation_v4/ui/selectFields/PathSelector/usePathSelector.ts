
import type { ExpressionValueType } from "@src/entites/automation_v4"
import {
    ObjectMap,
    ObjectNode
} from "@src/shared/lib/object-map/types"
import { useCallback, useMemo } from "react"

export interface PathSelectorLevel {
    path: string
    value: string
    items: string[]
}

interface UsePathSelectorProps {
    objectMap: ObjectMap
    initialPath: string
    value?: string
    maxDepth?: number
    minDepth?: number
    allowedValueTypes?: readonly ExpressionValueType[]
}

interface UsePathSelectorResult {
    segments: string[]
    path: string
    levels: PathSelectorLevel[]
    currentNode?: ObjectNode
    canContinue: boolean
    isValid: boolean
    relativeDepth: number
    updateSegment: (index: number, selected: string) => string[]
}


export const isNodeAllowedByTypes = (
    node: ObjectNode,
    allowedValueTypes?: readonly ExpressionValueType[]
): boolean => {

    if (allowedValueTypes === undefined) {
        return true
    }

    if (
        node.meta?.kind === "field" ||
        node.meta?.kind === "variable"
    ) {
        return node.meta.valueType !== undefined &&
            allowedValueTypes.includes(node.meta.valueType)
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
    initialPath,
    value,
    maxDepth,
    minDepth,
    allowedValueTypes
}: UsePathSelectorProps): UsePathSelectorResult => {

    const baseSegments = useMemo(
        () => initialPath.split(".").filter(Boolean),
        [initialPath]
    )

    const requestedSegments = useMemo(
        () => (value ?? initialPath).split(".").filter(Boolean),
        [value, initialPath]
    )

    /**
     * Проверяем, что выбранный путь начинается с initialPath.
     */
    const validPrefix = baseSegments.every(
        (segment, index) => requestedSegments[index] === segment
    )

    /**
     * Получаем существующие сегменты пути.
     *
     * Важно: здесь НЕ фильтруем выбранный путь по типу.
     * Это позволяет сохранить несовместимый путь и показать,
     * что он невалиден, вместо автоматического удаления.
     */
    const segments = useMemo(() => {

        if (!validPrefix) {
            return baseSegments
        }

        const result: string[] = []

        let currentChildren: Record<string, ObjectNode> = objectMap

        const depthLimit = maxDepth === undefined
            ? Infinity
            : baseSegments.length + maxDepth

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
        baseSegments,
        validPrefix,
        maxDepth
    ])

    const path = segments.join(".")

    const currentNode = useMemo(
        () => getObjectNode(objectMap, path),
        [objectMap, path]
    )

    const relativeDepth = Math.max(
        0,
        segments.length - baseSegments.length
    )

    /**
     * Строим уровни селектов.
     *
     * Для каждого уровня:
     * - показываем только разрешённые узлы;
     * - сохраняем текущий выбранный элемент,
     *   даже если его тип не подходит.
     */
    const levels = useMemo<PathSelectorLevel[]>(() => {

        const result: PathSelectorLevel[] = []

        for (
            let index = 0;
            index < relativeDepth;
            index++
        ) {

            const parentSegments = segments.slice(
                0,
                baseSegments.length + index
            )

            const parentPath = parentSegments.join(".")

            const selected = segments[
                baseSegments.length + index
            ]

            const parentNode = getObjectNode(
                objectMap,
                parentPath
            )

            const items = getAllowedChildren(
                parentNode,
                allowedValueTypes
            )

            // Не удаляем уже выбранный несовместимый элемент.
            if (selected && !items.includes(selected)) {
                items.push(selected)
            }

            result.push({
                path: parentPath,
                value: selected,
                items
            })
        }

        return result

    }, [
        objectMap,
        segments,
        baseSegments,
        relativeDepth,
        allowedValueTypes
    ])

    /**
     * Проверяем типы всех выбранных узлов после initialPath.
     */
    const typesValid = useMemo(() => {

        if (allowedValueTypes === undefined) {
            return true
        }

        if (allowedValueTypes.length === 0) {
            return false
        }

        for (
            let index = baseSegments.length;
            index < segments.length;
            index++
        ) {

            const node = getObjectNode(
                objectMap,
                segments.slice(0, index + 1).join(".")
            )

            if (!node || !isNodeAllowedByTypes(node, allowedValueTypes)) {
                return false
            }
        }

        return true

    }, [
        objectMap,
        segments,
        baseSegments,
        allowedValueTypes
    ])

    const depthValid =
        relativeDepth >= (minDepth ?? 0) &&
        relativeDepth <= (maxDepth ?? Infinity)

    const isValid =
        !!currentNode &&
        validPrefix &&
        depthValid &&
        typesValid

    /**
     * Можно ли продолжить выбор пути.
     */
    const canContinue =
        !!currentNode &&
        relativeDepth < (maxDepth ?? Infinity) &&
        getAllowedChildren(currentNode, allowedValueTypes).length > 0

    /**
     * Обновление сегмента пути.
     *
     * index — абсолютный индекс сегмента,
     * относительно полного пути, включая initialPath.
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
        currentNode,
        canContinue,
        isValid,
        relativeDepth,
        updateSegment
    }
}