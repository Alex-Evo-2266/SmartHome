import { SelectField } from "@src/shared"
import { CommandSelectorProps } from "./types"

export const CommandSelector = ({
    commands,
    value,
    onChange
}: CommandSelectorProps) => {

    const handleChange = (name: string) => {

        const command = commands.find(
            item => item.name === name
        )

        if (!command) return

        onChange(command)
    }

    return (
        <SelectField
            border
            items={commands.map(item => item.name)}
            value={value}
            onChange={handleChange}
        />
    )
}