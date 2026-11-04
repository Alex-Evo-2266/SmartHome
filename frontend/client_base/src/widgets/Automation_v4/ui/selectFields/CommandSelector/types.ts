export interface CommandParameter {
    name: string
    label: string
    type: string
    required?: boolean
    default?: unknown
}

export interface ObjectCommand {
    name: string
    label: string
    params?: CommandParameter[]
}

export interface CommandSelectorProps {
    commands: ObjectCommand[]
    value?: string
    onChange: (command: ObjectCommand) => void
}