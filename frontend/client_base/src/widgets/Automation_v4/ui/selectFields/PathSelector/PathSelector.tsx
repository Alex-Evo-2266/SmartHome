import type { ExpressionValueType } from "@src/entites/automation_v4"
import { SelectField } from "@src/shared"
import { ObjectMap } from "@src/shared/lib/object-map/types"
import { useEffect, useMemo, useState } from "react"

import {
    isNodeAllowedByTypes,
    usePathSelector
} from "./usePathSelector"

export interface PathSelectorProps {
    objectMap: ObjectMap
    initialPath: string
    value?: string
    maxDepth?: number
    minDepth?: number
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (path: string) => void
    onValidityChange?: (valid: boolean) => void
}

export const PathSelector = ({
    objectMap,
    initialPath,
    value,
    maxDepth,
    minDepth,
    allowedValueTypes,
    onChange,
    onValidityChange
}: PathSelectorProps) => {

    const [internalValue, setInternalValue] = useState(
        value ?? initialPath
    )

    useEffect(() => {

        if (value !== undefined) {
            setInternalValue(value)
            return
        }

        setInternalValue(initialPath)

    }, [value, initialPath])

    const currentValue = value ?? internalValue

    const {
        path,
        levels,
        currentNode,
        canContinue,
        isValid,
        updateSegment
    } = usePathSelector({
        objectMap,
        initialPath,
        value: currentValue,
        maxDepth,
        minDepth,
        allowedValueTypes
    })

    useEffect(() => {
        onValidityChange?.(isValid)
    }, [isValid, onValidityChange])

    const commit = (nextPath: string) => {

        if (value === undefined) {
            setInternalValue(nextPath)
        }

        onChange(nextPath)
    }

    const handleChange = (
        index: number,
        selected: string
    ) => {

        const nextSegments = updateSegment(
            index,
            selected
        )

        commit(nextSegments.join("."))
    }

    const handleNext = (selected: string) => {
        commit(`${path}.${selected}`)
    }

    const nextItems = useMemo(
        () => Object.entries(currentNode?.children ?? {})
            .filter(([, node]) =>
                isNodeAllowedByTypes(node, allowedValueTypes)
            )
            .map(([name]) => name),
        [currentNode, allowedValueTypes]
    )

    const baseDepth = initialPath.split(".").filter(Boolean).length

    return (
        <>
            {levels.map((level, index) => (
                <SelectField
                    key={level.path}
                    border
                    items={level.items}
                    value={level.value}
                    onChange={selected => handleChange(
                        baseDepth + index,
                        selected
                    )}
                />
            ))}

            {canContinue && (
                <SelectField
                    border
                    items={nextItems}
                    onChange={handleNext}
                />
            )}
        </>
    )
}