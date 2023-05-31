import { LucideIcon } from "lucide-react"

export interface IColumn{
    field: string
    title: string
	color?: string
    backgroundColor?: string
}

export type Column = IColumn

export interface ICell{
    content: string | number | LucideIcon
    color?: string
    onDelete?: ()=>void
    onClick?: ()=>void
}

export type celData = string | number | ICell

export interface IDataItem{
	[columnsName: string]:celData | celData[]
}

export interface ITableAction{
    icon: React.ReactNode
    onClick: (event: React.MouseEvent<HTMLElement>, data:IDataItem, index: number)=>void
}

export interface ITable{
    columns?: Column[]
    data: IDataItem[]
    actions?: ITableAction[]
    adaptive?: boolean
    onDelete?: (data:IDataItem, index: number)=>void
    onEdit?: (data:IDataItem, index: number)=>void
    onContextMenu?: (event: React.MouseEvent<HTMLElement>, data:IDataItem, index: number)=>void
    onClickRow?: (data:IDataItem, index: number)=>void
}