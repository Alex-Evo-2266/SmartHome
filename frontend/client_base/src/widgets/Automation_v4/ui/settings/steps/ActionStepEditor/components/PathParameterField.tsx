import type {
    ExpressionArg,
    ExpressionValueType,
    PathArg
} from "@src/entites/automation_v4"
import { SelectField } from "@src/shared"
import { ObjectNode } from "@src/shared/lib/object-map/types"
import { PathSelector } from "@src/widgets/Automation_v4/ui/selectFields/PathSelector/PathSelector"
import { useObjectMap } from "@src/widgets/Automation_v4/ui/selectFields/useObjectMap"

import { getPathSource } from "../utils/getPathSource"



interface Props {
    value?: ExpressionArg
    variables: Record<string, ObjectNode>
    allowedValueTypes?: readonly ExpressionValueType[]
    onChange: (value: PathArg) => void
}

export function PathParameterField({
    value,
    variables,
    allowedValueTypes,
    onChange
}: Props) {

    const pathValue =
        value?.type === "path"
            ? value.path
            : "device"

    const source = getPathSource(pathValue)

    const objectMap = useObjectMap({
        variables
    })

    return (
        <div style={{ display: "grid", gap: 12 }}>

            <SelectField
                border
                items={[
                    { value: "device", title: "Device" },
                    { value: "room", title: "Room" },
                    { value: "variable", title: "Variable" },
                    { value: "system", title: "System" }
                ]}
                value={source}
                onChange={selected => {
                    onChange({
                        type: "path",
                        path: selected
                    })
                }}
            />

            <PathSelector
                initialPath={source}
                objectMap={objectMap}
                value={pathValue}
                allowedValueTypes={allowedValueTypes}
                onChange={nextPath => {
                    onChange({
                        type: "path",
                        path: nextPath
                    })
                }}
            />
        </div>
    )
}