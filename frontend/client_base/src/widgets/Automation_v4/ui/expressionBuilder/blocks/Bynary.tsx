import {
    BinaryExpression,
    ExpressionArg
} from "@src/entites/automation_v4"

import { ChildBlock } from "../ChildBlock"
import { contextAutomation } from "../StartBlock"

import { useCallback, useContext } from "react"
import { getBinaryAllowedTypes } from "../../settings/steps/ActionStepEditor/utils/getAllowedValueTypes"


export const BynaryExpression = ({
    expression,
    id
}: {
    expression: BinaryExpression
    id: string
}) => {

    const {
        updateExpression,
        capabilities
    } = useContext(contextAutomation)

    const leftAllowedTypes = getBinaryAllowedTypes(
        capabilities,
        expression.op,
        "left"
    )

    const rightAllowedTypes = getBinaryAllowedTypes(
        capabilities,
        expression.op,
        "right"
    )

    const uleft = useCallback((data: ExpressionArg) => {
        updateExpression(id, current => {
            if (!current || current.type !== "binary") {
                throw new Error(
                    `Binary expression ${id} is missing or has changed type`
                )
            }

            return {
                ...current,
                left: data
            }
        })
    }, [id, updateExpression])

    const uright = useCallback((data: ExpressionArg) => {
        updateExpression(id, current => {
            if (!current || current.type !== "binary") {
                throw new Error(
                    `Binary expression ${id} is missing or has changed type`
                )
            }

            return {
                ...current,
                right: data
            }
        })
    }, [id, updateExpression])

    return (
        <div style={{
            display: "flex",
            border: "1px solid #000"
        }}>
            <span>
                <ChildBlock
                    data={expression.left}
                    allowedValueTypes={leftAllowedTypes}
                    onChange={uleft}
                />
            </span>

            {expression.op}

            <span>
                <ChildBlock
                    data={expression.right}
                    allowedValueTypes={rightAllowedTypes}
                    onChange={uright}
                />
            </span>
        </div>
    )
}