import type { AutomationStep } from "@src/entites/automation_v4";
import { StepJsonEditor } from "./StepJsonEditor";
import { PathSelector } from "../../selectFields/PathSelector/PathSelector";
import { useState } from "react";
import { useObjectMap } from "../../selectFields/useObjectMap";

interface Props {
  step: AutomationStep;
  onChange: (step: AutomationStep) => void;
  onDelete: () => void;
}

export function ActionStepEditor(props: Props) {
  const [pash, setPath] = useState("room")
  const [valis, setValid] = useState(false)
  const objectMap = useObjectMap({variables: {}})
  return (
    <>
      <StepJsonEditor
        {...props}
        title="Действие устройства"
      />
      <PathSelector initialPath="room" objectMap={objectMap} value={pash} onChange={setPath} onValidityChange={setValid}/>
    </>

  );
}