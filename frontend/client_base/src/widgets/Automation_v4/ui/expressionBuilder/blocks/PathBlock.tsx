import type { ExpressionValueType, PathArg } from "@src/entites/automation_v4"
import { DialogPortal } from "@src/shared"
import {
    BaseDialog,
    IconButton,
    Trash,
    Typography
} from "alex-evo-sh-ui-kit"
import { useContext, useState } from "react"

import {
    PathParameterField
} from "../../settings/steps/ActionStepEditor/components/PathParameterField"
import { contextAutomation } from "../StartBlock"




type PathBlockProps = {
    value?: PathArg
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (value: PathArg) => void
    onClear: () => void
}

export const PathBlock = ({
    value,
    allowedValueTypes,
    onChange,
    onClear
}: PathBlockProps) => {

    const [dialogVisible, setDialogVisible] = useState(false)

    return (
        <>
            <div onClick={() => setDialogVisible(true)}>
                <Typography type="body">
                    {!value?.path
                        ? "Выберите значение"
                        : value.path}
                </Typography>
            </div>

            <IconButton
                icon={<Trash />}
                onClick={onClear}
            />

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