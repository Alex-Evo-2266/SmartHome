import type {
  AutomationStep,
  DeviceCommand,
  DeviceCommandParameter,
  ExpressionArg,
} from "@src/entites/automation_v4";

import { useCallback, useMemo } from "react";
import { defaultParameterValue } from "../utils/defaultParameterValue";

interface Props {
  step: AutomationStep;
  commands: DeviceCommand[];
  onChange: (step: AutomationStep) => void;
}

export function useActionStep({
  step,
  commands,
  onChange,
}: Props) {
  const actionStep = step.type === "action" ? step : null;

  const selectedCommand = actionStep?.command ?? "";

  const commandDefinition = useMemo(
    () =>
      commands.find(
        command => command.name === selectedCommand,
      ) ?? null,
    [commands, selectedCommand],
  );

  const updateParameter = useCallback(
    (
      parameter: DeviceCommandParameter,
      value: ExpressionArg,
    ) => {
      if (!actionStep) return;

      onChange({
        ...actionStep,
        params: {
          ...actionStep.params,
          [parameter.name]: value,
        },
      });
    },
    [actionStep, onChange],
  );

  const setCommand = useCallback(
    (commandName: string) => {
      if (!actionStep) return;

      const nextCommand = commands.find(
        command => command.name === commandName,
      );

      if (!nextCommand) return;

      const nextParams: Record<string, ExpressionArg> = {};

      for (const parameter of nextCommand.parameters) {
        const previousValue =
          actionStep.params[parameter.name];

        nextParams[parameter.name] =
          previousValue ??
          defaultParameterValue(parameter);
      }

      onChange({
        ...actionStep,
        command: nextCommand.name,
        params: nextParams,
      });
    },
    [actionStep, commands, onChange],
  );

  return {
    actionStep,
    selectedCommand,
    commandDefinition,
    updateParameter,
    setCommand,
  };
}