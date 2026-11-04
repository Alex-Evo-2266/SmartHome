import { ObjectMap, ObjectNode } from "@src/shared/lib/object-map/types"
import { getObjectNode } from "@src/shared/lib/object-map/utils"
import { useCallback, useMemo } from "react"


export interface UsePathSelectorProps {
    objectMap: ObjectMap

    initialPath: string

    value?: string

    maxDepth?: number

    minDepth?: number
}

export interface PathSelectorLevel {
    path: string
    value: string
    items: string[]
}

export interface UsePathSelectorResult {
    segments: string[]

    path: string

    levels: PathSelectorLevel[]

    currentNode?: ObjectNode

    canContinue: boolean

    isValid: boolean

    relativeDepth: number

    updateSegment: (
        index: number,
        value: string
    ) => string[]
}

export const usePathSelector = ({
    objectMap,
    initialPath,
    value,
    maxDepth = Infinity,
    minDepth = 1
}: UsePathSelectorProps): UsePathSelectorResult => {

    const baseSegments = useMemo(
        () => initialPath.split(".").filter(Boolean),
        [initialPath]
    )

    const segments = useMemo(() => {

        const selected = value
            ? value.split(".").filter(Boolean)
            : baseSegments

        // Путь должен начинаться с initialPath.
        const hasBase = baseSegments.every(
            (segment, index) => selected[index] === segment
        )

        if (!hasBase) return baseSegments

        // Проверяем существование каждого сегмента.
        const result = [...baseSegments]

        for (
            let i = baseSegments.length;
            i < selected.length;
            i++
        ) {
            const parent = getObjectNode(
                objectMap,
                result.join(".")
            )

            if (!parent?.children?.[selected[i]]) break

            // Не допускаем превышение глубины.
            if (result.length - baseSegments.length >= maxDepth) {
                break
            }

            result.push(selected[i])
        }

        return result

    }, [
        value,
        baseSegments,
        objectMap,
        maxDepth
    ])

    const path = segments.join(".")

    const relativeDepth = segments.length - baseSegments.length

    const currentNode = useMemo(
        () => getObjectNode(objectMap, path),
        [objectMap, path]
    )

    /**
     * Формируем уровни выбора.
     *
     * Для каждого уже выбранного сегмента
     * получаем список доступных вариантов.
     */
    const levels = useMemo<PathSelectorLevel[]>(() => {

        const result: PathSelectorLevel[] = []

        for (
            let i = baseSegments.length;
            i < segments.length;
            i++
        ) {

            const parentPath = segments
                .slice(0, i)
                .join(".")

            const parent = getObjectNode(
                objectMap,
                parentPath
            )

            result.push({
                path: parentPath,
                value: segments[i],
                items: Object.keys(parent?.children ?? {})
            })
        }

        return result

    }, [
        objectMap,
        baseSegments,
        segments
    ])

    const canContinue = useMemo(() => {

        if (relativeDepth >= maxDepth) return false

        return Object.keys(
            currentNode?.children ?? {}
        ).length > 0

    }, [
        currentNode,
        relativeDepth,
        maxDepth
    ])

    const isValid =
        !!currentNode &&
        relativeDepth >= minDepth &&
        relativeDepth <= maxDepth

    /**
     * Изменение сегмента.
     *
     * Все следующие сегменты удаляются.
     */
    const updateSegment = useCallback((
        index: number,
        selected: string
    ): string[] => {

        return [
            ...segments.slice(0, index),
            selected
        ]

    }, [segments])

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