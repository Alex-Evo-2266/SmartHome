export interface NavItem{
    id: number
    title: string
    icon: string
    url: string
}

export type NavigationButton = {
    onClick: (event: React.MouseEvent<HTMLElement>)=>void
    icon?: React.ReactNode
    text?: string
} | undefined