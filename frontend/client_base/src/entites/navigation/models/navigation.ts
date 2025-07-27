
export interface NavigationItem{
    path: string,
    file: string,
    host: string,
    full_path: string,
    type: string,
    name: string,
    service: string
    page_name: string
}

export interface NavigationData{
    pages: NavigationItem[]
}