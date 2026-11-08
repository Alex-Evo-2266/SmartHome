import type {
    ExpressionArg,
    ExpressionValueType,
    PathArg
} from "@src/entites/automation_v4"
import { ObjectNode } from "@src/shared/lib/object-map/types"
import { PathSelector } from "@src/widgets/Automation_v4/ui/selectFields/PathSelector/PathSelector"
import { useObjectMap } from "@src/widgets/Automation_v4/ui/selectFields/useObjectMap"




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

    const objectMap = useObjectMap({
        variables
    })

    console.log(objectMap)

    return (
        <div style={{ display: "grid", gap: 12 }}>

            <PathSelector
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