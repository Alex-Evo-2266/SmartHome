
export enum TypeEntity{
    DEVICE = "device",
	TIME = "time",
	SERVICE = "service"
}

export enum TypeEntityCondition{
    DEVICE = "device",
	TIME = "time",
	SERVICE = "service",
}

export enum TypeEntityAction{
    DEVICE = "device",
	SERVICE = "service",
	SCRIPTS = "scripts",
	DELAY = "delay"
}

export enum Sign{
    EQUALLY = "equally",
	MORE = "more",
	LESS = "less"
}

export enum Condition{
    AND = "and",
	OR = "or"
}

export interface AutomationConditionData{
    id?: number
	type_entity: TypeEntityCondition
	entity: string
	sign: Sign
	value: string
}

export interface AutomationActionData{
    id?: number
	type_entity: TypeEntityAction
	entity: string
	value: string
}

export interface AutomationEntityData{
    id?: number
	type_entity: TypeEntity
	entity: string
}

export interface AutomationData{
    name: string
	system_name: string
	triggers: AutomationEntityData[]
	condition: Condition
	conditions: AutomationConditionData[]
	actions: AutomationActionData[]
	differently: AutomationActionData[]
	status: boolean
}

