
import {
    BinaryExpression,
    ExpressionArg
} from "@src/entites/automation_v4"

import {
    useCallback,
    useContext
} from "react"

import { ChildBlock } from "../ChildBlock"
import { contextAutomation } from "../StartBlock"

import { getBinaryAllowedTypes } from "../../settings/steps/ActionStepEditor/utils/getAllowedValueTypes"

import styles from "./Bynary.module.scss"

interface BinaryExpressionProps {
    expression: BinaryExpression
    id: string
}

export const BynaryExpression = ({
    expression,
    id
}: BinaryExpressionProps) => {

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

    const updateLeft = useCallback((data: ExpressionArg) => {
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

    const updateRight = useCallback((data: ExpressionArg) => {
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
        <div className={styles.expression}>

            <div className={styles.operands}>
                <div className={styles.operand}>

                    <ChildBlock
                        data={expression.left}
                        allowedValueTypes={leftAllowedTypes}
                        onChange={updateLeft}
                    />
                </div>

                <div className={styles.operator}>
                    {expression.op}
                </div>

                <div className={styles.operand}>

                    <ChildBlock
                        data={expression.right}
                        allowedValueTypes={rightAllowedTypes}
                        onChange={updateRight}
                    />
                </div>
            </div>
        </div>
    )
}
