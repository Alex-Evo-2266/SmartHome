import type {
  Automation,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { Button, ContentBox } from "alex-evo-sh-ui-kit";

import { PathParameterField } from "./PathParameterField";

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
  variables,
  onChange,
  onOpenExpression,
}: Props) {
  const isPathParameter =
    parameter.data_type === "path" ||
    parameter.name === "path";

    console.log(parameter, value)

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