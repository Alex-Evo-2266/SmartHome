import type {
    ExpressionCapabilitiesResponse,
    ExpressionValueType
} from "@src/entites/automation_v4"

type Capabilities = ExpressionCapabilitiesResponse
type AllowedValueTypes = readonly ExpressionValueType[] | undefined

export const getBinaryAllowedTypes = (
    capabilities: Capabilities | null,
    operatorId: string,
    argumentName: string
): AllowedValueTypes => {
    const operator = capabilities?.operators.binary.find(
        item => item.id === operatorId
    )

    return operator?.arguments.find(
        argument => argument.name === argumentName
    )?.value_types
}

export const getUnaryAllowedTypes = (
    capabilities: Capabilities | null,
    operatorId: string
): AllowedValueTypes => {
    const operator = capabilities?.operators.unary.find(
        item => item.id === operatorId
    )

    return operator?.arguments.find(
        argument => argument.name === "operand"
    )?.value_types
}

export const getGroupAllowedTypes = (
    capabilities: Capabilities | null,
    operatorId: string
): AllowedValueTypes => {
    const operator = capabilities?.operators.group.find(
        item => item.id === operatorId
    )

    return operator?.arguments.find(
        argument => argument.name === "items"
    )?.value_types
}

export const getFunctionAllowedTypes = (
    capabilities: Capabilities | null,
    functionId: string,
    argumentIndex: number
): AllowedValueTypes => {
    const fn = capabilities?.functions.find(
        item => item.id === functionId
    )

    const position = argumentIndex + 1
    const argument = fn?.arguments.find(
        item => item.position === position
    ) ?? fn?.arguments.find(item => {
        if (typeof item.position !== "string") {
            return false
        }

        const [rangeStart, rangeEnd, ...rest] = item.position.split("..")
        const firstPosition = Number(rangeStart)

        if (
            rest.length > 0 ||
            !Number.isInteger(firstPosition) ||
            position < firstPosition
        ) {
            return false
        }

        if (rangeEnd === "N") {
            return true
        }

        const lastPosition = Number(rangeEnd)
        return Number.isInteger(lastPosition) && position <= lastPosition
    })

    return argument?.value_types
}