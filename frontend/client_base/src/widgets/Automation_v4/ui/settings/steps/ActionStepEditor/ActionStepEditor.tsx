import type {
  Automation,
  AutomationStep,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";
import { SelectField } from "@src/shared";
import { useState } from "react";


import { StepJsonEditor } from "../StepJsonEditor";
import { ActionParameter } from "./components/ActionParameter";
import { useActionCommands } from "./hooks/useActionCommands";
import { useActionStep } from "./hooks/useActionStep";
import { ExpressionBuilderModal } from "../../../expressionBuilder/StartBlock";


interface Props {
  step: AutomationStep;
  parameters: Automation["parameters"];
  expressions: Automation["expressions"];

  onChange: (step: AutomationStep) => void;
  onDelete: () => void;

  onExpressionChange: (
    update: (expressions: Automation["expressions"]) => Automation["expressions"],
  ) => void;
}

interface ExpressionEditorState {
  parameter: DeviceCommandParameter;
  value: ExpressionArg | null
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

  if (!actionStep) return null;

  const variables = Object.fromEntries(
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
  );

  function openExpressionBuilder(
    parameter: DeviceCommandParameter,
  ) {
     const currentValue =
      actionStep?.params[parameter.name];
/**
    if (currentValue?.type === "ref") {
      if (!expressions[currentValue.ref]) {
        onExpressionChange({
          ...expressions,
          [currentValue.ref]: createDefaultExpression(),
        });
      }
    } else {
      const id = createExpressionId();

      onExpressionChange({
        ...expressions,
        [id]: createDefaultExpression(),
      });

      updateParameter(parameter, {
        type: "ref",
        ref: id,
      });
    }*/

    setExpressionEditor({
      parameter,
      value: currentValue ?? null
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

      {expressionEditor && expressionValue && (
        <ExpressionBuilderModal
          value={expressionValue}
          expressions={expressions}
          capabilities={capabilities}
          variables={variables}
          onChange={(value: ExpressionArg) =>{
            console.log(value)
            updateParameter(
              expressionEditor.parameter,
              value,
            )}
          }
          onExpressionsChange={onExpressionChange}
          onClose={() => setExpressionEditor(null)}
        />
      )}
    </>
  );
}