import type {
  DeviceCommandParameter,
  ExpressionArg,
  LiteralDataType,
} from "@src/entites/automation_v4";

import { SelectField } from "@src/shared";
import {
  NumberField,
  TextField,
} from "alex-evo-sh-ui-kit";

interface Props {
  parameter: DeviceCommandParameter;
  value?: ExpressionArg;
  onChange: (value: ExpressionArg) => void;
}

export function LiteralParameterField({
  parameter,
  value,
  onChange,
}: Props) {
  const literalValue =
    value?.type === "literal"
      ? value.value
      : undefined;

  if (parameter.data_type === "boolean") {
    return (
      <SelectField
        border
        placeholder={parameter.title || parameter.name}
        items={[
          { value: "true", title: "Да" },
          { value: "false", title: "Нет" },
        ]}
        value={
          literalValue === true
            ? "true"
            : literalValue === false
              ? "false"
              : ""
        }
        onChange={(selected: string) => {
          onChange({
            type: "literal",
            value: selected === "true",
            data_type: "boolean",
          });
        }}
      />
    );
  }

  if (parameter.data_type === "number") {
    return (
      <NumberField
        border
        placeholder={parameter.title || parameter.name}
        value={
          typeof literalValue === "number"
            ? literalValue
            : 0
        }
        onChange={(nextValue: number) => {
          onChange({
            type: "literal",
            value: nextValue,
            data_type: "number",
          });
        }}
      />
    );
  }

  return (
    <TextField
      border
      placeholder={parameter.title || parameter.name}
      value={
        literalValue !== undefined &&
        literalValue !== null
          ? String(literalValue)
          : ""
      }
      onChange={(nextValue: string) => {
        onChange({
          type: "literal",
          value: nextValue,
          data_type: getLiteralDataType(parameter.data_type)
        });
      }}
    />
  );
}

export function getLiteralDataType(
    dataType: DeviceCommandParameter["data_type"],
): LiteralDataType {
    switch (dataType) {
        case "number":
            return "number";
        case "boolean":
            return "boolean";
        case "string":
        case "any":
        case "path":
        default:
            return "string";
    }
}