
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
    value?: string
    maxDepth?: number
    minDepth?: number
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (path: string) => void
    onValidityChange?: (valid: boolean) => void
}

export const PathSelector = ({
    objectMap,
    value,
    maxDepth,
    minDepth,
    allowedValueTypes,
    onChange,
    onValidityChange
}: PathSelectorProps) => {


    const [internalValue, setInternalValue] = useState(value ?? "")

    /**
     * Синхронизируем внутреннее значение
     * с внешним value.
     */
    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value)
        }
    }, [value])

    const currentValue = value ?? internalValue

        console.log({
        objectMap,
        value: currentValue,
        maxDepth,
        minDepth,
        allowedValueTypes
    })

    const {
        path,
        levels,
        rootItems,
        currentNode,
        canContinue,
        isValid,
        updateSegment
    } = usePathSelector({
        objectMap,
        value: currentValue,
        maxDepth,
        minDepth,
        allowedValueTypes
    })
    console.log(path, levels)

    /**
     * Передаём наружу состояние валидности.
     */
    useEffect(() => {
        onValidityChange?.(isValid)
    }, [isValid, onValidityChange])

    /**
     * Сохранение нового пути.
     */
    const commit = (nextPath: string) => {
        if (value === undefined) {
            setInternalValue(nextPath)
        }

        onChange(nextPath)
    }

    /**
     * Изменение существующего уровня.
     *
     * Все последующие уровни сбрасываются.
     */
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

    /**
     * Выбор первого или следующего уровня.
     */
    const handleNext = (selected: string) => {
        commit(
            path
                ? `${path}.${selected}`
                : selected
        )
    }

    /**
     * Доступные дочерние элементы текущего узла.
     */
    const nextItems = useMemo(
        () =>
            Object.entries(currentNode?.children ?? {})
                .filter(([, node]) =>
                    isNodeAllowedByTypes(
                        node,
                        allowedValueTypes
                    )
                )
                .map(([name]) => name),
        [
            currentNode,
            allowedValueTypes
        ]
    )

    /**
     * Если путь пустой, показываем корневой Select.
     */
    const showRoot = levels.length === 0

    return (
        <>
            {showRoot && (
                <SelectField
                    style={{marginBlock: "0"}}
                    border
                    items={rootItems}
                    onChange={handleNext}
                />
            )}

            {levels.map(level => (
                <SelectField
                    style={{marginBlock: "0"}}
                    key={level.index}
                    border
                    items={level.items}
                    value={level.value}
                    onChange={selected =>
                        handleChange(
                            level.index,
                            selected
                        )
                    }
                />
            ))}

            {canContinue && (
                <SelectField
                    style={{marginBlock: "0"}}
                    border
                    items={nextItems}
                    onChange={handleNext}
                />
            )}
        </>
    )
}
