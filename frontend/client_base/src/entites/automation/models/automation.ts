// Enums corresponding to ConditionType, Operation, and SetType
export enum ConditionType {
    AND = "and",
    OR = "or"
}

export enum Operation {
    MORE = ">",
    LESS = "<",
    MORE_OR_EQUAL = ">=",
    LESS_OR_EQUAL = "<=",
    EQUAL = "==",
    NOT_EQUAL = "!="
}

export enum SetType {
    DATA = "data",
    COMMAND = "command"
}

// Trigger item interface
export interface TriggerItem {
    service: string;
    object: string;
    data: string;
}

// Condition item interface
export interface ConditionItem {
    operation: Operation;
    arg1_service: string;
    arg1_object: string;
    arg1_data: string;
    arg2_service: string;
    arg2_object: string;
    arg2_data: string;
}

// Action item interface
export interface ActionItem {
    service: string;
    object: string;
    field: string;
    data: string;
    type_set: SetType;
}

// Automation schema interface
export interface Automation {
    name: string;
    trigger: TriggerItem[];
    condition: ConditionItem[];
    condition_type: ConditionType;
    then: ActionItem[];
    else_branch: ActionItem[];
    is_enabled?: boolean; // Optional, defaults to true in Python
}

// Enable schema interface
export interface EnableSchema {
    is_enabled?: boolean; // Optional, defaults to true in Python
}
