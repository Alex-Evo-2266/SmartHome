import type { ExpressionValueType } from "@src/entites/automation_v4"
import { TypeDeviceField } from "@src/entites/devices"

export const ROOT_NAMESPASE_ARRAY = [
    "device",
    "room",
    "variable",
    "system"
] as const

export type ROOT_NAMESPASE =
    typeof ROOT_NAMESPASE_ARRAY[number]

export type ObjectNodeKind =
    | "namespace"
    | "object"
    | "field"
    | "variable"

export interface ObjectNodeMeta {
    kind?: ObjectNodeKind
    type?: TypeDeviceField
    valueType?: ExpressionValueType
    readonly?: boolean
}

export interface ObjectNode {
    label?: string

    children?: Record<string, ObjectNode>

    meta?: ObjectNodeMeta
}

export type ObjectMap = Record<string, ObjectNode>

export interface UseObjectMapProps {
    variables?: Record<string, ObjectNode>
    system?: Record<string, ObjectNode>
}