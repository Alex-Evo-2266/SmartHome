import { Automation, AutomationExpression, DeviceCommandDataType, ExpressionArg, ExpressionCapabilitiesResponse, ExpressionValueType } from "@src/entites/automation_v4"
import { DialogPortal } from "@src/shared"
import { ObjectNode } from "@src/shared/lib/object-map/types"
import { FullScreenTemplateDialog } from "alex-evo-sh-ui-kit"
import { createContext, ReactNode, useCallback } from "react"

import { ChildBlock } from "./ChildBlock"

type Expressions = Automation["expressions"]
type ExpressionChange = (
    update: (expressions: Expressions) => Expressions,
) => void
type UpdateExpression = (
    id: string,
    update: (expression: AutomationExpression | undefined) => AutomationExpression,
) => void

export const contextAutomation = createContext<
    {expressions: Expressions, updateExpression: UpdateExpression, variables: Record<string, ObjectNode>, capabilities: ExpressionCapabilitiesResponse | null}
>({expressions:{}, updateExpression:()=>{}, variables: {}, capabilities:null})

export const ExpressionContext = ({
    children,
    expressions,
    updateExpression,
    variables,
    capabilities
}: {
    variables: Record<string, ObjectNode>
    children: ReactNode
    expressions: Expressions
    updateExpression: UpdateExpression
    capabilities: ExpressionCapabilitiesResponse | null
}) => {
    return (
        <contextAutomation.Provider value={{expressions, updateExpression, variables, capabilities}}>
            {children}
        </contextAutomation.Provider>
    )
}

type ExForPath = Exclude<DeviceCommandDataType, "for_path">

export const ExpressionBuilder = ({enum_vals, type, expressions, updateExpression, onChange, value, variables, capabilities}:
    {
        type: ExForPath
        expressions: Expressions, 
        updateExpression: UpdateExpression,
        onChange: (data: ExpressionArg)=>void
        value:ExpressionArg, 
        variables: Record<string, ObjectNode>
        capabilities: ExpressionCapabilitiesResponse | null
        enum_vals?: string[] 
    }) => {

        const types:ExpressionValueType[] = type === "any" ? 
        ["ISO-время", "boolean", "datetime", "duration", "number", "path", "string", "time"] : 
        [type]

    return(
        <ExpressionContext expressions={expressions} updateExpression={updateExpression} variables={variables} capabilities={capabilities}>
            <div>
                <span style={{marginRight: "10px"}}>=</span>
                <ChildBlock enum_values={enum_vals} allowedValueTypes={types} data={value} onChange={onChange}/>
            </div>
        </ExpressionContext>
    )
}

type ExpressionBuilderModalProps = {
    expressions: Expressions, 
    value:ExpressionArg, 
    capabilities: ExpressionCapabilitiesResponse | null
    onChange: (value: ExpressionArg)=>void
    onClose: ()=>void
    onExpressionsChange: ExpressionChange
    variables: Record<string, ObjectNode>;
    pathType: ExForPath | undefined
    type: DeviceCommandDataType
    enum_vals?: string[] 
}


export const ExpressionBuilderModal = ({enum_vals, pathType, expressions, onExpressionsChange, onChange, value, onClose, variables, capabilities, type}:ExpressionBuilderModalProps) => {

    const expressionChange = useCallback<UpdateExpression>((id, update) => {
        onExpressionsChange((currentExpressions) => {
            const expression = update(currentExpressions[id])
            return {...currentExpressions, [id]: expression}
        })
    },[onExpressionsChange])

    const type2: ExForPath = type === "for_path"? pathType === undefined ? "any" : pathType : type

    const l = () => {
        console.log("d")
    }

    return(
        <DialogPortal>
            <FullScreenTemplateDialog btns={[
                {
                    text: "ok", 
                    onClick: onClose
                }
            ]}>
                <ExpressionBuilder enum_vals={enum_vals} type={type2} variables={variables} value={value} expressions={expressions} updateExpression={expressionChange} onChange={onChange} capabilities={capabilities}/>
            </FullScreenTemplateDialog>
        </DialogPortal>
    )
}