import type { Automation, AutomationStep } from "@src/entites/automation_v4";
import { SelectField } from "@src/shared";

import { StepJsonEditor } from "./StepJsonEditor";
import { PathSelector } from "../../selectFields/PathSelector/PathSelector";
import { useObjectMap } from "../../selectFields/useObjectMap";

interface Props {
  step: AutomationStep;
  parameters: Automation["parameters"];
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
}

export function ActionStepEditor(props: Props) {
  const variables = Object.fromEntries(
    Object.keys(props.parameters ?? {}).map(name => [
      name,
      { meta: { kind: "variable" as const } },
    ]),
  )
  const objectMap = useObjectMap({variables})
  const actionStep = props.step.type === "action" ? props.step : null
  const pathArg = actionStep?.params.path
  const pathValue =
    pathArg?.type === "literal" && typeof pathArg.value === "string"
      ? pathArg.value
      : pathArg?.type === "path"
        ? pathArg.path
      : ""
  const firstPathSegment = pathValue.split(".")[0]
  const initialPath =
    firstPathSegment === "device" ||
    firstPathSegment === "room" ||
    firstPathSegment === "variable"
      ? firstPathSegment
      : "room"

  function updatePath(path: string) {
    if (!actionStep) return

    props.onChange({
      ...actionStep,
      params: {
        ...actionStep.params,
        path: {
          type: "path",
          path,
        },
      },
    })
  }

  return (
    <>
      <StepJsonEditor
        step={props.step}
        onChange={props.onChange}
        onDelete={props.onDelete}
        title="Действие устройства"
      />
      <SelectField
        border
        items={["device", "room", "variable"]}
        value={initialPath}
        onChange={updatePath}
      />
      <PathSelector
        initialPath={initialPath}
        objectMap={objectMap}
        value={pathValue || initialPath}
        onChange={updatePath}
      />
    </>
  );
}