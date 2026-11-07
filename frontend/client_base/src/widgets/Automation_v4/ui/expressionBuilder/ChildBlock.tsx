import {
    BinaryExpression,
    BinaryOperator,
    CallExpression,
    ExpressionArg,
    ExpressionBlockSelection,
    GroupExpression,
    GroupOperator,
    UnaryExpression,
    UnaryOperator,
    ExpressionValueType
} from "@src/entites/automation_v4"
import {
    IconButton,
    Trash
} from "alex-evo-sh-ui-kit"
import {
    useCallback,
    useContext,
    useState
} from "react"
import { v4 as uuidv4 } from "uuid"

import { AddBlock } from "./AddBlock"
import { PathBlock } from "./blocks/PathBlock"
import { RefBlock } from "./blocks/RefBlock"
import { SelectBlockModal } from "./SelectBlockModal"
import { contextAutomation } from "./StartBlock"

type ChildBlockProps = {
    data: ExpressionArg | null
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (data: ExpressionArg) => void
}

export const ChildBlock = ({
    data,
    onChange,
    allowedValueTypes
}: ChildBlockProps) => {

    const [addBlockVisible, setAddBlockVisible] = useState(false)

    const { updateExpression } = useContext(contextAutomation)

    const onClear = useCallback(() => {
        onChange({
            type: "ref",
            ref: null
        })
    }, [onChange])

    const selectBlock = (selected: ExpressionBlockSelection) => {

        if (selected.kind === "literal") {
            onChange({
                type: "literal"
            })
        }

        else if (selected.kind === "path") {
            onChange({
                type: "path",
                path: ""
            })
        }

        else if (selected.kind === "function") {

            const id = uuidv4()

            const expression: CallExpression = {
                type: "call",
                fn: selected.fn,
                args: []
            }

            updateExpression(id, () => expression)

            onChange({
                type: "ref",
                ref: id
            })
        }

        else if (selected.kind === "operator") {

            const id = uuidv4()

            if (selected.expressionType === "binary") {

                const expression: BinaryExpression = {
                    type: "binary",
                    op: selected.op as BinaryOperator,
                    left: null,
                    right: null
                }

                updateExpression(id, () => expression)

                onChange({
                    type: "ref",
                    ref: id
                })
            }

            else if (selected.expressionType === "unary") {

                const expression: UnaryExpression = {
                    type: "unary",
                    op: selected.op as UnaryOperator,
                    operand: null
                }

                updateExpression(id, () => expression)

                onChange({
                    type: "ref",
                    ref: id
                })
            }

            else if (selected.expressionType === "group") {

                const expression: GroupExpression = {
                    type: "group",
                    op: selected.op as GroupOperator,
                    items: []
                }

                updateExpression(id, () => expression)

                onChange({
                    type: "ref",
                    ref: id
                })
            }
        }
    }

    if (data === null) {
        return (
            <>
                <AddBlock onClick={() => setAddBlockVisible(true)} />

                {addBlockVisible && (
                    <SelectBlockModal
                        onHide={() => setAddBlockVisible(false)}
                        onSelect={selectBlock}
                    />
                )}
            </>
        )
    }

    if (data.type === "literal") {
        return (
            <>
                <input
                    value={data.value != null ? String(data.value) : ""}
                    onChange={event => onChange({
                        ...data,
                        value: event.target.value
                    })}
                />

                <IconButton
                    icon={<Trash />}
                    onClick={onClear}
                />
            </>
        )
    }

    if (data.type === "path") {
        return (
            <PathBlock
                allowedValueTypes={allowedValueTypes}
                value={data}
                onChange={onChange}
                onClear={onClear}
            />
        )
    }

    if (data.type === "ref") {

        if (data.ref === null) {
            return (
                <>
                    <AddBlock onClick={() => setAddBlockVisible(true)} />

                    {addBlockVisible && (
                        <SelectBlockModal
                            onHide={() => setAddBlockVisible(false)}
                            onSelect={selectBlock}
                        />
                    )}
                </>
            )
        }

        return (
            <RefBlock id={data.ref} onClear={onClear} />
        )
    }

    return null
}