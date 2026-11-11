import { useMemo } from "react";

import type { Automation } from "@src/entites/automation_v4";

export function buildAutomationVariables(
  parameters?: Automation["parameters"],
) {
  return Object.fromEntries(
    Object.entries(parameters ?? {}).map(([name, parameter]) => {
      const { type } = parameter.definition;

      return [
        name,
        {
          meta: {
            kind: "variable" as const,
            ...(type !== "path" && type !== "for_path"
              ? { valueType: type }
              : {}),
          },
        },
      ];
    }),
  );
}

export function useAutomationVariables(
  parameters?: Automation["parameters"],
) {
  return useMemo(() => buildAutomationVariables(parameters), [parameters]);
}
