
export interface ControlElementbase{
    type: "bool" | "number" | "text" | "enum"
    data: string
    title: string
    readonly: boolean
    width: 1 | 2 | 3 | 4
}

export interface ControlElementBool extends ControlElementbase{
    type: "bool"
    data: string
    readonly: boolean
    width: 1 | 2
}

export interface ControlElementNumberReadonly extends ControlElementbase{
    type: "number"
    data: string
    readonly: true
    width: 1 | 2
}

export interface ControlElementNumberControl extends ControlElementbase{
    type: "number"
    data: string
    readonly: false
    width: 2
}

export type ControlElementNumber = ControlElementNumberReadonly | ControlElementNumberControl

export type ControlElement = ControlElementBool | ControlElementNumber

export interface DashboardCardBase{
    title: string
    id?: string
    type: string
}

export interface DashboardCardGrid extends DashboardCardBase{
    type: "grid"
    items: ControlElement[]
}

export type DashboardCard = DashboardCardGrid