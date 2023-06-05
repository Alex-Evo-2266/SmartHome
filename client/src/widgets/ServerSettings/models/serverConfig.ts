
export interface ResponseData{
    moduleConfig: Dict<Dict<string>>
}

export interface ConfigData{
    name: string
    content: ConfigDataItem[]
}

export interface ConfigDataItem{
    name: string
    value: string
}