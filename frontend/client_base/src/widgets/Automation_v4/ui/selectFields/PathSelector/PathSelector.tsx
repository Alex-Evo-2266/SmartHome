import { SelectField } from "@src/shared"
import { ObjectMap } from "@src/shared/lib/object-map/types"
import { useEffect, useMemo, useState } from "react"
import { usePathSelector } from "./usePathSelector"

export interface PathSelectorProps {
    objectMap: ObjectMap
    initialPath: string
    value?: string
    maxDepth?: number
    minDepth?: number
    onChange: (path: string) => void
    onValidityChange?: (valid: boolean) => void
}

export const PathSelector = ({
    objectMap,
    initialPath,
    value,
    maxDepth,
    minDepth,
    onChange,
    onValidityChange
}: PathSelectorProps) => {

    const [internalValue, setInternalValue] = useState(initialPath)

    // Если initialPath изменился, сбрасываем локальный выбор.
    useEffect(() => {
        if (value === undefined) {
            setInternalValue(initialPath)
        }
    }, [initialPath, value])

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
        minDepth
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
        const nextSegments = updateSegment(index, selected)

        commit(nextSegments.join("."))
    }

    const handleNext = (selected: string) => {
        commit(`${path}.${selected}`)
    }

    const nextItems = useMemo(
        () => Object.keys(currentNode?.children ?? {}),
        [currentNode]
    )

    const baseDepth = initialPath.split(".").filter(Boolean).length
    console.log(levels, canContinue)
    return (
        <>
            {levels.map((level, index) => (
                <SelectField
                    key={level.path}
                    border
                    items={level.items}
                    value={level.value}
                    onChange={data => handleChange(
                        baseDepth + index,
                        data
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