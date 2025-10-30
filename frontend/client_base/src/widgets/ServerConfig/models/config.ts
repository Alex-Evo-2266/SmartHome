

export enum ConfigItemType {
    NUMBER = "number",
    TEXT = "text",
    PASSWORD = "password",
    MORE_TEXT = "more"
}

export interface ConfigItem {
    key: string
    value: string
    tag: string
    type: ConfigItemType
}