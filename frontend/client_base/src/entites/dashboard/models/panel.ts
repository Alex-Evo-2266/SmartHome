export type TypeControlElements = "bool" | "number" | "text" | "enum" | "button"

export interface ControlElementbase{
    type: TypeControlElements
    data: string
    title: string
    readonly: boolean
    width: 1 | 2 | 3 | 4
    icon: string
}

export interface ControlElementButton extends ControlElementbase{
    type: "button"
}

export interface ControlElementBool extends ControlElementbase{
    type: "bool"
}

export interface ControlElementNumber extends ControlElementbase{
    type: "number"
}

export interface ControlElementTextControl extends ControlElementbase{
    type: "text" | "enum"
}


export type ControlElement = ControlElementBool | ControlElementNumber | ControlElementTextControl | ControlElementButton

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

export interface Dashboard{
    title: string
    id: string
    private: boolean,
    cards: DashboardCard[]
}

export interface Dashboards{
    dashboards: Dashboard[]
}