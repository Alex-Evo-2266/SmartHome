import { Automation, AutomationExpression, ExpressionArg, ExpressionCapabilitiesResponse } from "@src/entites/automation_v4"
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


export const ExpressionBuilder = ({expressions, updateExpression, onChange, value, variables, capabilities}:
    {
        expressions: Expressions, 
        updateExpression: UpdateExpression,
        onChange: (data: ExpressionArg)=>void
        value:ExpressionArg, 
        variables: Record<string, ObjectNode>
        capabilities: ExpressionCapabilitiesResponse | null
    }) => {

    return(
        <ExpressionContext expressions={expressions} updateExpression={updateExpression} variables={variables} capabilities={capabilities}>
            <span>=</span>
            <ChildBlock data={value} onChange={onChange}/>
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
}


export const ExpressionBuilderModal = ({expressions, onExpressionsChange, onChange, value, onClose, variables, capabilities}:ExpressionBuilderModalProps) => {

    const expressionChange = useCallback<UpdateExpression>((id, update) => {
        onExpressionsChange((currentExpressions) => {
            const expression = update(currentExpressions[id])
            return {...currentExpressions, [id]: expression}
        })
    },[onExpressionsChange])

    return(
        <DialogPortal>
            <FullScreenTemplateDialog onHide={onClose}>
                <ExpressionBuilder variables={variables} value={value} expressions={expressions} updateExpression={expressionChange} onChange={onChange} capabilities={capabilities}/>
            </FullScreenTemplateDialog>
        </DialogPortal>
    )
}