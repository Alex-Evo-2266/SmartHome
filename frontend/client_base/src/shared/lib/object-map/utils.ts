import {
    ObjectMap,
    ObjectNode
} from "./types"

/**
 * Получить узел по полному пути.
 *
 * Например:
 * device.lamp_1.state
 */
export const getObjectNode = (
    objectMap: ObjectMap,
    path: string
): ObjectNode | undefined => {

    const segments = path
        .split(".")
        .filter(Boolean)

    if (!segments.length) return undefined

    let current: ObjectNode | undefined = objectMap[segments[0]]

    if (!current) return undefined

    for (let i = 1; i < segments.length; i++) {
        current = current.children?.[segments[i]]

        if (!current) return undefined
    }

    return current
}

/**
 * Получить дочерние элементы узла.
 */
export const getObjectChildren = (
    objectMap: ObjectMap,
    path: string
): Record<string, ObjectNode> => {
    return getObjectNode(objectMap, path)?.children ?? {}
}

/**
 * Проверить существование пути.
 */
export const hasObjectPath = (
    objectMap: ObjectMap,
    path: string
): boolean => {
    return !!getObjectNode(objectMap, path)
}

/**
 * Проверить, можно ли продолжить путь.
 */
export const hasObjectChildren = (
    objectMap: ObjectMap,
    path: string
): boolean => {
    return Object.keys(
        getObjectChildren(objectMap, path)
    ).length > 0
}