import type { ExpressionArg } from "@src/entites/automation_v4"
import { Button } from "alex-evo-sh-ui-kit"
import { useContext, useMemo, useState } from "react"

import { contextAutomation } from "../StartBlock"
import { BynaryExpression } from "./Bynary"
import {
    getFunctionAllowedTypes,
    getGroupAllowedTypes,
    getUnaryAllowedTypes
} from "../../settings/steps/ActionStepEditor/utils/getAllowedValueTypes"
import { ChildBlock } from "../ChildBlock"


export const RefBlock = ({id, onClear}:{id:string, onClear: ()=>void}) => {

    const {
        expressions,
        updateExpression,
        capabilities
    } = useContext(contextAutomation)

    const expression = useMemo(()=>expressions[id],[expressions, id])
    const [addingArgument, setAddingArgument] = useState(false)

    if(expression === undefined)
        return(
            <Button onClick={onClear}>
                выражение не найдено. Очистка
            </Button>
    )

    if(expression.type === "binary")
    {
        return <BynaryExpression expression={expression} id={id}/>
    }

    if (expression.type === "unary") {
        const allowedValueTypes = getUnaryAllowedTypes(
            capabilities,
            expression.op
        )

        return (
            <div style={{ display: "flex", border: "1px solid #000" }}>
                {expression.op}
                <ChildBlock
                    data={expression.operand}
                    allowedValueTypes={allowedValueTypes}
                    onChange={data => updateExpression(id, current => {
                        if (!current || current.type !== "unary") {
                            throw new Error(
                                `Unary expression ${id} is missing or has changed type`
                            )
                        }

                        return { ...current, operand: data }
                    })}
                />
            </div>
        )
    }

    if (expression.type === "group") {
        const allowedValueTypes = getGroupAllowedTypes(
            capabilities,
            expression.op
        )

        const updateItem = (index: number, data: ExpressionArg) => {
            updateExpression(id, current => {
                if (!current || current.type !== "group") {
                    throw new Error(
                        `Group expression ${id} is missing or has changed type`
                    )
                }

                const items = [...current.items]
                items[index] = data
                return { ...current, items }
            })
        }

        const appendItem = (data: ExpressionArg) => {
            updateExpression(id, current => {
                if (!current || current.type !== "group") {
                    throw new Error(
                        `Group expression ${id} is missing or has changed type`
                    )
                }

                return { ...current, items: [...current.items, data] }
            })
            setAddingArgument(false)
        }

        return (
            <div style={{ display: "grid", border: "1px solid #000" }}>
                <strong>{expression.op}</strong>
                {expression.items.map((item, index) => (
                    <ChildBlock
                        key={index}
                        data={item}
                        allowedValueTypes={allowedValueTypes}
                        onChange={data => updateItem(index, data)}
                    />
                ))}
                {addingArgument ? (
                    <ChildBlock
                        data={null}
                        allowedValueTypes={allowedValueTypes}
                        onChange={appendItem}
                    />
                ) : (
                    <Button onClick={() => setAddingArgument(true)}>
                        Добавить аргумент
                    </Button>
                )}
            </div>
        )
    }

    const updateArgument = (index: number, data: ExpressionArg) => {
        updateExpression(id, current => {
            if (!current || current.type !== "call") {
                throw new Error(
                    `Function expression ${id} is missing or has changed type`
                )
            }

            const args = [...current.args]
            args[index] = data
            return { ...current, args }
        })
    }

    const appendArgument = (data: ExpressionArg) => {
        updateExpression(id, current => {
            if (!current || current.type !== "call") {
                throw new Error(
                    `Function expression ${id} is missing or has changed type`
                )
            }

            return { ...current, args: [...current.args, data] }
        })
        setAddingArgument(false)
    }

    const functionDefinition = capabilities?.functions.find(
        item => item.id === expression.fn
    )
    const canAddArgument =
        !functionDefinition ||
        functionDefinition.max_args === null ||
        expression.args.length < functionDefinition.max_args

    return (
        <div style={{ display: "grid", border: "1px solid #000" }}>
            <strong>{expression.fn}</strong>
            {expression.args.map((argument, index) => (
                <ChildBlock
                    key={index}
                    data={argument}
                    allowedValueTypes={getFunctionAllowedTypes(
                        capabilities,
                        expression.fn,
                        index
                    )}
                    onChange={data => updateArgument(index, data)}
                />
            ))}
            {canAddArgument && (addingArgument ? (
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
                <Button onClick={() => setAddingArgument(true)}>
                    Добавить аргумент
                </Button>
            ))}
        </div>
    )
}