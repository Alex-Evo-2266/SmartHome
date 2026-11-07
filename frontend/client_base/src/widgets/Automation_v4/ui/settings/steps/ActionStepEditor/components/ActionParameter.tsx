import type {
  Automation,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { SelectField } from "@src/shared";
import { Button, ContentBox } from "alex-evo-sh-ui-kit";

import { LiteralParameterField } from "./LiteralParameterField";
import { PathParameterField } from "./PathParameterField";
import { RefParameterField } from "./RefParameterField";

import { getValueMode } from "../utils/getValueMode";
import { defaultParameterValue } from "../utils/defaultParameterValue";
import { ObjectNode } from "@src/shared/lib/object-map/types";

interface Props {
  parameter: DeviceCommandParameter;
  value?: ExpressionArg;
  expressions: Automation["expressions"];
  variables: Record<string, ObjectNode>;

  onChange: (value: ExpressionArg) => void;
  onOpenExpression: () => void;
}

export function ActionParameter({
  parameter,
  value,
  expressions,
  variables,
  onChange,
  onOpenExpression,
}: Props) {
  const mode = getValueMode(value);

  const isPathParameter =
    parameter.data_type === "path" ||
    parameter.name === "path";

  function changeMode(selected: string) {
    if (selected === "literal") {
      onChange(defaultParameterValue(parameter));
      return;
    }

    if (selected === "path") {
      onChange({
        type: "path",
        path:
          value?.type === "path"
            ? value.path
            : "device",
      });
      return;
    }

    if (selected === "ref") {
      onOpenExpression();
    }
  }

  return (
    <ContentBox
      border
      collapsible
      defaultVisible
      label={parameter.title || parameter.name}
    >
      <div style={{ display: "grid", gap: 12 }}>
        {parameter.description && (
          <div>{parameter.description}</div>
        )}
        {isPathParameter ? 
          <PathParameterField
            value={value}
            variables={variables}
            onChange={onChange}
          />:
          <Button
                type="button"
                onClick={onOpenExpression}
              >
                Редакт выражений
              </Button>
        }

              
      </div>
    </ContentBox>
  );
}