export  enum TypeScriptNode {
    TRIGGER = "trigger",
	CONDITION = 'condition',
    ACTION = 'action',
    Start = 'start'
}

export interface ScriptCreate{
    id?: string
    name: string
    description: string
    nods: ScriptNode[]
    edgs: ScriptEdge[]
}

export interface ScriptNode{
    id: string
    type: TypeScriptNode
    expression: string
    description?: string
    x: number
    y: number
}

export interface ScriptEdge{
    id?: string
    id_start: string
    id_end: string
    condition_label?: string
}
