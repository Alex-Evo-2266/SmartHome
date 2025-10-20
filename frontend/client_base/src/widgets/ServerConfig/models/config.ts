

export enum ConfigItemType {
    NUMBER = "number",
    TEXT = "text",
    PASSWORD = "password"
}

export interface ConfigItem {
    key: string
    value: string
    tag: string
    type: ConfigItemType
}