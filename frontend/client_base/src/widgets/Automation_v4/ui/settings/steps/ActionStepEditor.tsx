import type { AutomationStep } from "@src/entites/automation_v4";
import { StepJsonEditor } from "./StepJsonEditor";
import { PathSelector } from "../../selectFields/PathSelector/PathSelector";
import { useObjectMap } from "../../selectFields/useObjectMap";

interface Props {
  step: AutomationStep;
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
}

export function ActionStepEditor(props: Props) {
  const objectMap = useObjectMap({variables: {}})
  const actionStep = props.step.type === "action" ? props.step : null
  const pathArg = actionStep?.params.path
  const pathValue =
    pathArg?.type === "literal" && typeof pathArg.value === "string"
      ? pathArg.value
      : ""

  function updatePath(path: string) {
    if (!actionStep) return

    props.onChange({
      ...actionStep,
      params: {
        ...actionStep.params,
        path: {
          type: "literal",
          value: path,
          data_type: "string",
        },
      },
    })
  }

  return (
    <>
      <StepJsonEditor
        {...props}
        title="Действие устройства"
      />
      <PathSelector
        initialPath="room"
        objectMap={objectMap}
        value={pathValue || "room"}
        onChange={updatePath}
      />
    </>
  );
}