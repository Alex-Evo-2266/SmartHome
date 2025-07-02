import { createContext } from "react";
import { TypeScriptNode } from "../models/script";

export interface EditNode{
    type: TypeScriptNode
    id: string
    expression: string
    description?: string
}

export interface EditNodeContext{
    editNode: (data:EditNode) => void
}

export const ScriptConstructorEditContext = createContext<EditNodeContext>({editNode:()=>{}})
