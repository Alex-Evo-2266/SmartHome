import { createContext, ReactNode } from "react";
import { ExpressionCapabilitiesResponse, OperatorCategory, OperatorDefinition } from "../models/automation";
import { useAutomationExpressionCapabilities } from "../api/useAutomationAPI";


export const capabilitiesContext = createContext<{capabilities: ExpressionCapabilitiesResponse, error: string | null, loading:boolean}>({capabilities: {
        functions:[],
        types: {},
        argument_types: {},
        operators: {} as Record<OperatorCategory, OperatorDefinition[]>
    },
    loading: false,
    error: null
})

export const CapabilitiesContextProvider = ({children}:{children: ReactNode}) => {

    const {expressionCapabilities, error, loading} = useAutomationExpressionCapabilities()

    return(
        <capabilitiesContext.Provider value={{capabilities:expressionCapabilities, loading, error}}>
            {children}
        </capabilitiesContext.Provider>
    )
}