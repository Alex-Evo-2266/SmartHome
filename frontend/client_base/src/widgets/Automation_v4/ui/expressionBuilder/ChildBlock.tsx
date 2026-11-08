
import {
    BinaryExpression,
    BinaryOperator,
    CallExpression,
    ExpressionArg,
    ExpressionBlockSelection,
    ExpressionValueType,
    GroupExpression,
    GroupOperator,
    UnaryExpression,
    UnaryOperator
} from "@src/entites/automation_v4"

import {
    useCallback,
    useContext,
    useState
} from "react"

import { v4 as uuidv4 } from "uuid"

import { PathBlock } from "./blocks/PathBlock"
import { RefBlock } from "./blocks/RefBlock"
import { SelectBlockModal } from "./SelectBlockModal"
import { contextAutomation } from "./StartBlock"

import { ExpressionAddButton } from "./components/ExpressionAddButton"
import { LiteralValueEditor } from "./components/LiteralValueEditor"

import styles from "./ChildBlock.module.scss"

type ChildBlockProps = {
    data: ExpressionArg | null
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (data: ExpressionArg) => void
    enum_values?: string[]
}

type LiteralArg = Extract<ExpressionArg, { type: "literal" }>

export const ChildBlock = ({
    data,
    onChange,
    allowedValueTypes,
    enum_values
}: ChildBlockProps) => {

    const [addBlockVisible, setAddBlockVisible] = useState(false)

    const { updateExpression } = useContext(contextAutomation)

    const onClear = useCallback(() => {
        onChange({
            type: "ref",
            ref: null
        })
    }, [onChange])

    const selectBlock = useCallback((
        selected: ExpressionBlockSelection
    ) => {

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

        setAddBlockVisible(false)

    }, [onChange, updateExpression])

    const openModal = () => {
        setAddBlockVisible(true)
    }

    const renderAddModal = () => {
        if (!addBlockVisible) return null

        return (
            <SelectBlockModal
                onHide={() => setAddBlockVisible(false)}
                onSelect={selectBlock}
            />
        )
    }

    // Empty expression slot
    if (
        data === null ||
        (data.type === "ref" && data.ref === null)
    ) {
        return (
            <div className={styles.emptySlot}>
                <ExpressionAddButton onClick={openModal} />
                {renderAddModal()}
            </div>
        )
    }

    // Literal
    if (data.type === "literal") {

        return (
            <div className={styles.expressionBlock}>

                <div className={styles.blockContent}>
                    <LiteralValueEditor
                        data={data as LiteralArg}
                        allowedValueTypes={allowedValueTypes}
                        enum_values={enum_values}
                        onChange={onChange}
                    />
                </div>

                <button
                    type="button"
                    className={styles.removeButton}
                    onClick={onClear}
                    title="Удалить значение"
                >
                    ×
                </button>
            </div>
        )
    }

    // Path
    if (data.type === "path") {

        return (
            <div className={styles.expressionBlock}>

                <div className={styles.blockContent}>
                    <PathBlock
                        allowedValueTypes={allowedValueTypes}
                        value={data}
                        onChange={onChange}
                    />
                </div>

                <button
                    type="button"
                    className={styles.removeButton}
                    onClick={onClear}
                    title="Удалить путь"
                >
                    ×
                </button>
            </div>
        )
    }

    // Reference to nested expression
    if (data.type === "ref") {

        return (
            <div className={styles.expressionBlock}>

                <div className={styles.blockContent}>
                    <RefBlock
                        id={data.ref!}
                        onClear={onClear}
                    />
                </div>

                <button
                    type="button"
                    className={styles.removeButton}
                    onClick={onClear}
                    title="Удалить выражение"
                >
                    ×
                </button>
            </div>
        )
    }

    return null
}
