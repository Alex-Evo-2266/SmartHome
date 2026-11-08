
import type { ExpressionArg } from "@src/entites/automation_v4"

import {
    useCallback,
    useContext,
    useMemo,
    useState
} from "react"

import { contextAutomation } from "../StartBlock"
import { ChildBlock } from "../ChildBlock"
import { ExpressionAddButton } from "../components/ExpressionAddButton"
import { BynaryExpression } from "./Bynary"

import {
    getFunctionAllowedTypes,
    getGroupAllowedTypes,
    getUnaryAllowedTypes
} from "../../settings/steps/ActionStepEditor/utils/getAllowedValueTypes"

import styles from "./RefBlock.module.scss"

interface RefBlockProps {
    id: string
    onClear: () => void
}

export const RefBlock = ({
    id,
    onClear
}: RefBlockProps) => {

    const {
        expressions,
        updateExpression,
        capabilities
    } = useContext(contextAutomation)

    const expression = useMemo(
        () => expressions[id],
        [expressions, id]
    )

    const [addingArgument, setAddingArgument] = useState(false)

    const updateItem = useCallback((
        index: number,
        data: ExpressionArg
    ) => {
        updateExpression(id, current => {
            if (!current || current.type !== "group") {
                throw new Error(
                    `Group expression ${id} is missing or has changed type`
                )
            }

            const items = [...current.items]
            items[index] = data

            return {
                ...current,
                items
            }
        })
    }, [id, updateExpression])

    const appendGroupItem = useCallback((
        data: ExpressionArg
    ) => {
        updateExpression(id, current => {
            if (!current || current.type !== "group") {
                throw new Error(
                    `Group expression ${id} is missing or has changed type`
                )
            }

            return {
                ...current,
                items: [...current.items, data]
            }
        })

        setAddingArgument(false)
    }, [id, updateExpression])

    const updateArgument = useCallback((
        index: number,
        data: ExpressionArg
    ) => {
        updateExpression(id, current => {
            if (!current || current.type !== "call") {
                throw new Error(
                    `Function expression ${id} is missing or has changed type`
                )
            }

            const args = [...current.args]
            args[index] = data

            return {
                ...current,
                args
            }
        })
    }, [id, updateExpression])

    const appendArgument = useCallback((
        data: ExpressionArg
    ) => {
        updateExpression(id, current => {
            if (!current || current.type !== "call") {
                throw new Error(
                    `Function expression ${id} is missing or has changed type`
                )
            }

            return {
                ...current,
                args: [...current.args, data]
            }
        })

        setAddingArgument(false)
    }, [id, updateExpression])

    if (!expression) {
        return (
            <div className={styles.missingExpression}>
                <span>Выражение не найдено</span>

                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={onClear}
                >
                    Очистить
                </button>
            </div>
        )
    }

    // Binary expression
    if (expression.type === "binary") {
        return (
            <BynaryExpression
                expression={expression}
                id={id}
            />
        )
    }

    // Unary expression
    if (expression.type === "unary") {
        const allowedValueTypes = getUnaryAllowedTypes(
            capabilities,
            expression.op
        )

        return (
            <div className={styles.expression}>
                <div className={styles.header}>
                    <span className={styles.typeLabel}>
                        OPERATOR
                    </span>

                    <span className={styles.expressionName}>
                        {expression.op}
                    </span>

                    <span className={styles.argumentCount}>
                        1 аргумент
                    </span>
                </div>

                <div className={styles.arguments}>
                    <ChildBlock
                        data={expression.operand}
                        allowedValueTypes={allowedValueTypes}
                        onChange={data => {
                            updateExpression(id, current => {
                                if (
                                    !current ||
                                    current.type !== "unary"
                                ) {
                                    throw new Error(
                                        `Unary expression ${id} is missing or has changed type`
                                    )
                                }

                                return {
                                    ...current,
                                    operand: data
                                }
                            })
                        }}
                    />
                </div>
            </div>
        )
    }

    // Group expression
    if (expression.type === "group") {
        const allowedValueTypes = getGroupAllowedTypes(
            capabilities,
            expression.op
        )

        return (
            <div className={styles.expression}>
                <div className={styles.header}>
                    <span className={styles.typeLabel}>
                        GROUP
                    </span>

                    <span className={styles.expressionName}>
                        {expression.op}
                    </span>

                    <span className={styles.argumentCount}>
                        {expression.items.length} арг.
                    </span>
                </div>

                <div className={styles.arguments}>
                    {expression.items.map((item, index) => (
                        <div
                            className={styles.argument}
                            key={index}
                        >
                            <ChildBlock
                                data={item}
                                allowedValueTypes={allowedValueTypes}
                                onChange={data => updateItem(index, data)}
                            />

                            {index < expression.items.length - 1 && (
                                <span className={styles.separator}>
                                    {expression.op}
                                </span>
                            )}
                        </div>
                    ))}

                    {addingArgument ? (
                        <ChildBlock
                            data={null}
                            allowedValueTypes={allowedValueTypes}
                            onChange={appendGroupItem}
                        />
                    ) : (
                        <ExpressionAddButton
                            onClick={() => setAddingArgument(true)}
                        />
                    )}
                </div>
            </div>
        )
    }

    // Function expression
    const functionDefinition = capabilities?.functions.find(
        item => item.id === expression.fn
    )

    const canAddArgument =
        !functionDefinition ||
        functionDefinition.max_args === null ||
        expression.args.length < functionDefinition.max_args

    return (
        <div className={styles.expression}>
            <div className={styles.header}>
                <span className={styles.typeLabel}>
                    FUNCTION
                </span>

                <span className={styles.expressionName}>
                    {expression.fn}
                </span>

                <span className={styles.argumentCount}>
                    {expression.args.length}
                    {functionDefinition?.max_args != null
                        ? ` / ${functionDefinition.max_args}`
                        : " арг."
                    }
                </span>
            </div>

            <div className={styles.arguments}>
                {expression.args.map((argument, index) => (
                    <div
                        className={styles.argument}
                        key={index}
                    >
                        <ChildBlock
                            data={argument}
                            allowedValueTypes={getFunctionAllowedTypes(
                                capabilities,
                                expression.fn,
                                index
                            )}
                            onChange={data => updateArgument(index, data)}
                        />

                        {index < expression.args.length - 1 && (
                            <span className={styles.separator}>
                                ,
                            </span>
                        )}
                    </div>
                ))}

                {canAddArgument && (
                    addingArgument ? (
                        <ChildBlock
                            data={null}
                            allowedValueTypes={getFunctionAllowedTypes(
                                capabilities,
                                expression.fn,
                                expression.args.length
                            )}
                            onChange={appendArgument}
                        />
                    ) : (
                        <ExpressionAddButton
                            onClick={() => setAddingArgument(true)}
                        />
                    )
                )}
            </div>
        </div>
    )
}
