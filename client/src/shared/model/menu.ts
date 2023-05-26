
export interface IMenuSubItem{
    title: string
    icon?: React.ReactNode
    activated?: boolean
    onClick?: ()=>void
}

export interface IMenuItem{
    title: string
    icon?: React.ReactNode
    activated?: boolean
    onClick?: ()=>void
    subItems?: IMenuSubItem[]
}

export interface IBlock{
    items: IMenuItem[]
}



