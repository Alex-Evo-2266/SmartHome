import type {
  Automation,
  AutomationStep,
  DeviceCommandDataType,
  DeviceCommandParameter,
  ExpressionArg,
  PathArg,
} from "@src/entites/automation_v4";

import { SelectField } from "@src/shared";
import type { ObjectMap, ObjectNode } from "@src/shared/lib/object-map/types";
import { useMemo, useState } from "react";

// Путь импорта укажи согласно расположению своего хука.

import { StepJsonEditor } from "../StepJsonEditor";
import { ActionParameter } from "./components/ActionParameter";
import { useActionCommands } from "./hooks/useActionCommands";
import { useActionStep } from "./hooks/useActionStep";
import { ExpressionBuilderModal } from "../../../expressionBuilder/StartBlock";
import { useObjectMap } from "../../../selectFields/useObjectMap";
import { TypeDeviceField } from "@src/entites/devices";

type ExForPath = Exclude<DeviceCommandDataType, "for_path">

export function mapDeviceFieldTypeToCommandDataType(
  type?: TypeDeviceField | null,
): ExForPath {
  switch (type) {
    case TypeDeviceField.BINARY:
      return "boolean";

    case TypeDeviceField.NUMBER:
    case TypeDeviceField.COUNTER:
      return "number";

    case TypeDeviceField.TEXT:
      return "string";
    case TypeDeviceField.ENUM:
      return "enum";

    case TypeDeviceField.BASE:
    default:
      return "any";
  }
}

interface Props {
  step: AutomationStep;
  parameters: Automation["parameters"];
  expressions: Automation["expressions"];

  onChange: (step: AutomationStep) => void;
  onDelete: () => void;

  onExpressionChange: (
    update: (
      expressions: Automation["expressions"],
    ) => Automation["expressions"],
  ) => void;
}

interface ExpressionEditorState {
  parameter: DeviceCommandParameter;
  value: ExpressionArg | null;
}

function isPathArg(value: unknown): value is PathArg {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "path" &&
    "path" in value &&
    typeof value.path === "string"
  );
}

/**
 * Получает конечный узел ObjectMap по пути.
 *
 * Например:
 * device.living_room.temperature
 *
 * Последовательно проходит:
 * device -> living_room -> temperature
 */
function getObjectNode(
  objectMap: ObjectMap,
  path: string,
): ObjectNode | undefined {
  const segments = path.split(".").filter(Boolean);

  if (!segments.length) {
    return undefined;
  }

  let current: ObjectNode | undefined = objectMap[segments[0]];

  for (const segment of segments.slice(1)) {
    current = current?.children?.[segment];

    if (!current) {
      return undefined;
    }
  }

  return current;
}

/**
 * Возвращает тип конечного поля по выбранному пути.
 */
function getPathFieldType(
  objectMap: ObjectMap,
  pathValue: unknown,
): {type: ExForPath | undefined, enum_vals?: string[]} {
  if (!isPathArg(pathValue)) {
    return {
      type: undefined,
      enum_vals: undefined
    };
  }

  const node = getObjectNode(objectMap, pathValue.path);

  return {
    type:mapDeviceFieldTypeToCommandDataType(node?.meta?.type) ?? undefined,
    enum_vals: node?.meta?.enum_vals
  }
}

export function ActionStepEditor({
  step,
  parameters,
  expressions,
  onChange,
  onDelete,
  onExpressionChange,
}: Props) {
  const {
    commands,
    capabilities,
    loading,
  } = useActionCommands();

  const {
    actionStep,
    selectedCommand,
    commandDefinition,
    updateParameter,
    setCommand,
  } = useActionStep({
    step,
    commands,
    onChange,
  });

  const [expressionEditor, setExpressionEditor] =
    useState<ExpressionEditorState | null>(null);

  const variables = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(parameters ?? {}).map(([name, parameter]) => {
          const { type } = parameter.definition;

          return [
            name,
            {
              meta: {
                kind: "variable" as const,
                ...(type !== "path" ? { valueType: type } : {}),
              },
            },
          ];
        }),
      ),
    [parameters],
  );

  // Собираем дерево доступных объектов и переменных.
  const objectMap = useObjectMap({ variables });

  if (!actionStep) return null;

  // Получаем тип конечного поля выбранного пути.
  const {type: pathType, enum_vals} = getPathFieldType(
    objectMap,
    actionStep.params["path"],
  );

  function openExpressionBuilder(
    parameter: DeviceCommandParameter,
  ) {
    const currentValue = actionStep?.params[parameter.name];

    setExpressionEditor({
      parameter,
      value: currentValue ?? null,
    });
  }

  const expressionValue: ExpressionArg | undefined =
    expressionEditor
      ? actionStep.params[expressionEditor.parameter.name]
      : undefined;

  return (
    <>
      <StepJsonEditor
        step={step}
        onChange={onChange}
        onDelete={onDelete}
        title="Действие устройства"
      />

      <div
        style={{
          display: "grid",
          gap: 12,
          padding: "12px 0",
        }}
      >
        <SelectField
          border
          placeholder="Выберите команду"
          items={commands.map(command => ({
            value: command.name,
            title: command.title || command.name,
          }))}
          value={selectedCommand}
          onChange={setCommand}
        />

        {loading && <div>Загрузка команд...</div>}

        {commandDefinition && (
          <>
            {commandDefinition.description && (
              <div>{commandDefinition.description}</div>
            )}

            {commandDefinition.parameters.map(parameter => (
              <ActionParameter
                key={parameter.name}
                parameter={parameter}
                value={actionStep.params[parameter.name]}
                expressions={expressions}
                variables={variables}
                onChange={value =>
                  updateParameter(parameter, value)
                }
                onOpenExpression={() =>
                  openExpressionBuilder(parameter)
                }
              />
            ))}
          </>
        )}
      </div>

      {commandDefinition && expressionEditor && expressionValue && (
        <ExpressionBuilderModal
          type={expressionEditor.parameter.data_type}
          pathType={pathType}
          enum_vals={enum_vals}
          value={expressionValue}
          expressions={expressions}
          capabilities={capabilities}
          variables={variables}
          onChange={(value: ExpressionArg) => {
            updateParameter(
              expressionEditor.parameter,
              value,
            );
          }}
          onExpressionsChange={onExpressionChange}
          onClose={() => {console.log("d"), setExpressionEditor(null)}}
        />
      )}
    </>
  );
}