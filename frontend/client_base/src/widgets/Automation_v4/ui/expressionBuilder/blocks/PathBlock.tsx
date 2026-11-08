
import type {
    ExpressionValueType,
    PathArg
} from "@src/entites/automation_v4"

import { DialogPortal } from "@src/shared"

import {
    useContext,
    useState
} from "react"

import {
    PathParameterField
} from "../../settings/steps/ActionStepEditor/components/PathParameterField"

import { contextAutomation } from "../StartBlock"

import styles from "./PathBlock.module.scss"
import { BaseDialog } from "alex-evo-sh-ui-kit"

type PathBlockProps = {
    value?: PathArg
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (value: PathArg) => void
}

export const PathBlock = ({
    value,
    allowedValueTypes,
    onChange
}: PathBlockProps) => {

    const [dialogVisible, setDialogVisible] = useState(false)

    return (
        <>
            <button
                type="button"
                className={`${styles.pathButton} ${
                    value?.path ? styles.selected : styles.empty
                }`}
                onClick={() => setDialogVisible(true)}
                title={value?.path || "Выбрать путь"}
            >
                <span className={styles.pathLabel}>
                    PATH
                </span>

                <span className={styles.pathValue}>
                    {value?.path || "Выберите значение"}
                </span>

                <span className={styles.editIcon}>
                    ✎
                </span>
            </button>

            {dialogVisible && (
                <PathDialog
                    value={value}
                    allowedValueTypes={allowedValueTypes}
                    onChange={onChange}
                    onClose={() => setDialogVisible(false)}
                />
            )}
        </>
    )
}

type PathDialogProps = {
    value?: PathArg
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (value: PathArg) => void
    onClose: () => void
}

export const PathDialog = ({
    value,
    allowedValueTypes,
    onChange,
    onClose
}: PathDialogProps) => {

    const { variables } = useContext(contextAutomation)

    console.log(allowedValueTypes)

    return (
        <DialogPortal>
            <BaseDialog onHide={onClose}>
                <PathParameterField
                    variables={variables}
                    value={value}
                    allowedValueTypes={allowedValueTypes}
                    onChange={onChange}
                />
            </BaseDialog>
        </DialogPortal>
    )
}