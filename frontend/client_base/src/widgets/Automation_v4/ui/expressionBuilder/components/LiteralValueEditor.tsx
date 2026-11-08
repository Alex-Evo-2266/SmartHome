
import {
    ExpressionArg,
    ExpressionValueType
} from "@src/entites/automation_v4"

import styles from "./LiteralValueEditor.module.scss"

type LiteralArg = Extract<ExpressionArg, { type: "literal" }>

interface LiteralValueEditorProps {
    data: LiteralArg
    allowedValueTypes?: readonly ExpressionValueType[]
    enum_values?: string[]
    onChange: (data: ExpressionArg) => void
}

type valueType = LiteralArg["value"]

export const LiteralValueEditor = ({
    data,
    allowedValueTypes,
    enum_values,
    onChange
}: LiteralValueEditorProps) => {

    const types = allowedValueTypes ?? []

    const updateValue = (value: valueType) => {
        onChange({
            ...data,
            value
        })
    }

    const value = data.value

    // Enum
    if (enum_values !== undefined) {
        return (
            <select
                className={styles.select}
                value={value != null ? String(value) : ""}
                onChange={event => updateValue(event.target.value)}
            >
                <option value="" disabled>
                    Выберите значение
                </option>

                {enum_values.map(item => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        )
    }

    // Number / Duration
    if (
        types.includes("number") ||
        types.includes("duration")
    ) {
        return (
            <input
                className={styles.input}
                type="number"
                value={value != null ? String(value) : ""}
                onChange={event => {
                    const raw = event.target.value

                    updateValue(
                        raw === "" ? null : Number(raw)
                    )
                }}
                placeholder="Число"
            />
        )
    }


    // Boolean
    if (types.includes("boolean")) {
        return (
            <select
                className={styles.select}
                value={value == null ? "" : String(value)}
                onChange={event => {
                    updateValue(event.target.value === "true")
                }}
            >
                <option value="" disabled>
                    Выберите значение
                </option>
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        )
    }

    // Time
    if (types.includes("time")) {
        return (
            <input
                className={styles.input}
                type="time"
                value={value != null ? String(value) : ""}
                onChange={event => updateValue(event.target.value)}
            />
        )
    }

    // Date and datetime
    if (
        types.includes("datetime") ||
        types.includes("ISO-время")
    ) {
        return (
            <input
                className={styles.input}
                type="datetime-local"
                value={value != null ? String(value) : ""}
                onChange={event => updateValue(event.target.value)}
            />
        )
    }

    // String / Path / fallback
    return (
        <input
            className={styles.input}
            type="text"
            value={value != null ? String(value) : ""}
            onChange={event => updateValue(event.target.value)}
            placeholder="Введите значение"
        />
    )
}
