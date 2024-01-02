
export enum TypeEntity{
    DEVICE = "device",
	TIME = "time",
	SERVICE = "service",
	PERIOD = "period"
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

export interface TriggerConditionData{
    id?: number
	type_entity: TypeEntityCondition
	entity: string
	sign: Sign
	value: string
}

export interface TriggerActionData{
    id?: number
	type_entity: TypeEntityAction
	entity: string
	value: string
}

export interface TriggerEntityData{
    id?: number
	type_entity: TypeEntity
	entity: string
}

export interface TriggerData{
    name: string
	system_name: string
	entities: TriggerEntityData[]
	condition: Condition
	conditions: TriggerConditionData[]
	actions: TriggerActionData[]
	differently: TriggerActionData[]
	status: boolean
}

