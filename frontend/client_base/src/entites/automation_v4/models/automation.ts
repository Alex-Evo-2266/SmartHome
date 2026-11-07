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

export type LiteralDataTypeWithOutDuration = Exclude<LiteralDataType, "duration">


// ─── Параметры сценария ─────────────────────────────────────

export interface ValueParameterDefinition {
    type: LiteralDataTypeWithOutDuration
    default?: number | string | boolean | null
}

export interface PathParameterDefinition {
    type: "path"
    default?: string | null
}

export type ParameterDefinition =
    | ValueParameterDefinition
    | PathParameterDefinition

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
    ref: string | null
}

export interface PathArg {
    type: "path"
    path: string
}

export type ExpressionArg =
    | LiteralArg
    | RefArg
    | PathArg

export type ExpressionArgWithNull = ExpressionArg | null


// ─── Выражения ──────────────────────────────────────────────

export interface BinaryExpression {
    type: "binary"
    op: BinaryOperator
    left: ExpressionArgWithNull
    right: ExpressionArgWithNull
}

export interface UnaryExpression {
    type: "unary"
    op: UnaryOperator
    operand: ExpressionArgWithNull
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

export type DeviceCommandTarget =
    | "device"
    | "system"
    | "room"
    | "field"

export type DeviceCommandDataType =
    | "number"
    | "string"
    | "boolean"
    | "any"
    | "path"

export interface DeviceCommandParameter {
    name: string
    title: string
    data_type: DeviceCommandDataType
    required: boolean
    description?: string | null
}

export interface DeviceCommand {
    name: string
    title: string
    description?: string | null
    target: DeviceCommandTarget
    parameters: DeviceCommandParameter[]
}

export interface EnableAutomationRequest {
    is_enabled: boolean
}

export type ExpressionArgumentType = "literal" | "ref" | "path";

export type ExpressionValueType =
    | "number"
    | "integer"
    | "string"
    | "boolean"
    | "time"
    | "duration"
    | "path"
    | "numeric string"
    | "ISO-время"
    | "datetime";

export type OperatorCategory = "binary" | "unary" | "group";

export interface ExpressionArgumentDefinition {
    name: string;
    position: number | string;
    required: boolean;
    expression_arg_types: ExpressionArgumentType[];
    value_types: ExpressionValueType[];
    default?: unknown;
}

export interface OperatorDefinition {
    id: string;
    name: string;
    category: OperatorCategory;
    description: string;
    argument_count: number | {
        minimum: number;
        maximum: number | null;
    };
    arguments: ExpressionArgumentDefinition[];
    result_type: string;
    validation: string;
    example_json: Record<string, unknown>;
}

export interface FunctionDefinition {
    id: string;
    name: string;
    description: string;
    arguments: ExpressionArgumentDefinition[];
    min_args: number;
    max_args: number | null;
    result_type: string;
    validation: string;
    evaluation: "eager" | "lazy";
    example_json: Record<string, unknown>;
}

export interface ExpressionCapabilitiesResponse {
    types: Record<string, {
        id: string;
        name: string;
        description: string;
        json_shape: Record<string, unknown>;
        required_fields: string[];
        optional_fields: string[];
        argument_types: ExpressionArgumentType[];
        example_json: Record<string, unknown>;
    }>;
    operators: Record<OperatorCategory, OperatorDefinition[]>;
    functions: FunctionDefinition[];
    argument_types: Record<string, {
        id: string;
        description: string;
        format: Record<string, unknown>;
        required_fields: string[];
        optional_fields: string[];
        validation: string;
        example_json: Record<string, unknown>;
    }>;
}

export type ExpressionBlockSelection =
    | {
        kind: "operator";
        expressionType: "binary";
        op: string;
        definition: OperatorDefinition;
    }
    | {
        kind: "operator";
        expressionType: "unary";
        op: string;
        definition: OperatorDefinition;
    }
    | {
        kind: "operator";
        expressionType: "group";
        op: string;
        definition: OperatorDefinition;
    }
    | {
        kind: "function";
        expressionType: "call";
        fn: string;
        definition: FunctionDefinition;
    }
    | {
        kind: "literal";
        expressionType: "literal";
    }
    | {
        kind: "path";
        expressionType: "path";
    };



export interface ExpressionBuilderModalProps {
  value: ExpressionArg;

  expressions: Automation["expressions"];

  capabilities: ExpressionCapabilitiesResponse | null;

  onChange: (value: ExpressionArg) => void;

  onExpressionsChange: (
    expressions: Automation["expressions"],
  ) => void;

  onClose: () => void;
}