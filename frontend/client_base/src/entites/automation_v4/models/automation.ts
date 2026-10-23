/**
 * Типы клиентской части для automation_v4.py
 */

export type BinaryOperator =
    | "eq" | "ne"
    | "lt" | "lte" | "gt" | "gte"
    | "add" | "sub" | "mul" | "div" | "mod" | "pow"
    | "concat" | "before" | "after"

export type UnaryOperator = "not" | "neg"

export type GroupOperator = "and" | "or" | "add" | "mul"

export type LiteralDataType =
    | "number"
    | "string"
    | "boolean"
    | "time"
    | "duration"


// ─── Параметры сценария ─────────────────────────────────────

export interface ValueParameterDefinition {
    type: "value"
    data_type: LiteralDataType
    default?: number | string | boolean | null
}

export interface DeviceParameterDefinition {
    type: "device"
    device_type?: string | null
}

export interface RoomDeviceParameterDefinition {
    type: "room_device"
    device_type: string
}

export type ParameterDefinition =
    | ValueParameterDefinition
    | DeviceParameterDefinition
    | RoomDeviceParameterDefinition

export interface ScriptParameter {
    title: string
    description?: string | null
    required: boolean
    definition: ParameterDefinition
}


// ─── Аргументы выражений ────────────────────────────────────

export interface LiteralArg {
    type: "literal"
    value?: number | string | boolean | null
    data_type?: LiteralDataType | null
}

export interface RefArg {
    type: "ref"
    ref: string
}

export interface PathArg {
    type: "path"
    path: string
}

export type ExpressionArg =
    | LiteralArg
    | RefArg
    | PathArg


// ─── Выражения ──────────────────────────────────────────────

export interface BinaryExpression {
    type: "binary"
    op: BinaryOperator
    left: ExpressionArg
    right: ExpressionArg
}

export interface UnaryExpression {
    type: "unary"
    op: UnaryOperator
    operand: ExpressionArg
}

export interface CallExpression {
    type: "call"
    fn: string
    args: ExpressionArg[]
}

export interface GroupExpression {
    type: "group"
    op: GroupOperator
    items: ExpressionArg[]
}

export type AutomationExpression =
    | BinaryExpression
    | UnaryExpression
    | CallExpression
    | GroupExpression


// ─── Триггеры ───────────────────────────────────────────────

export interface DeviceTrigger {
    type: "device"
    device: string
    field: string
    condition?: RefArg | null
}

export interface RoomTrigger {
    type: "room"
    room: string
    device_type: string
    field: string
    condition?: RefArg | null
}

export interface OnceTimeTrigger {
    type: "time"
    kind: "once"
    run_at: string
    timezone?: string | null
}

export interface WeeklyTimeTrigger {
    type: "time"
    kind: "weekly"
    at: string
    weekdays: number[]
    timezone?: string | null
    active_from?: string | null
    active_until?: string | null
}

export interface MonthlyTimeTrigger {
    type: "time"
    kind: "monthly"
    at: string
    month_days: number[]
    timezone?: string | null
}

export interface IntervalTimeTrigger {
    type: "time"
    kind: "interval"
    interval: number
    unit: "seconds" | "minutes" | "hours" | "days"
    timezone?: string | null
}

export type TimeTrigger =
    | OnceTimeTrigger
    | WeeklyTimeTrigger
    | MonthlyTimeTrigger
    | IntervalTimeTrigger

export type AutomationTrigger =
    | DeviceTrigger
    | RoomTrigger
    | TimeTrigger


// ─── Шаги сценария ──────────────────────────────────────────

export interface DelayStep {
    type: "delay"
    duration: ExpressionArg
    label?: string | null
    next?: string | null
}

export interface ActionStep {
    type: "action"
    path: string
    command: string
    params: Record<string, ExpressionArg>
    label?: string | null
    next?: string | null
}

export interface ScriptActionStep {
    type: "script"
    script: string
    params: Record<string, ExpressionArg>
    label?: string | null
    next?: string | null
}

export interface ConditionStep {
    type: "condition"
    condition: ExpressionArg
    on_true?: string | null
    on_false?: string | null
    label?: string | null
    next?: string | null
}

export interface AwaitStep {
    type: "await"
    trigger: AutomationTrigger
    timeout?: ExpressionArg | null
    on_timeout?: string | null
    label?: string | null
    next?: string | null
}

export type AutomationStep =
    | DelayStep
    | ActionStep
    | ScriptActionStep
    | ConditionStep
    | AwaitStep


// ─── Сценарий ───────────────────────────────────────────────

export interface Automation {
    schema_version: string
    id: string
    name: string
    description?: string | null

    trigger: AutomationTrigger[]

    parameters: Record<string, ScriptParameter>

    entry: string

    steps: Record<string, AutomationStep>

    expressions: Record<string, AutomationExpression>

    is_enabled: boolean
}


// ─── API ────────────────────────────────────────────────────

export interface AutomationListResponse {
    data: Automation[]
}

export interface EnableAutomationRequest {
    is_enabled: boolean
}