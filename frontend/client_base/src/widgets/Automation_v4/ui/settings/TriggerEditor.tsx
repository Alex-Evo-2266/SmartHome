import type { Automation, AutomationTrigger } from "@src/entites/automation_v4";
import { Button, ContentBox } from "alex-evo-sh-ui-kit";
import { useState } from "react";

import { AddTrigger } from "./dialogs/AddTrigger";
import { TriggerFields } from "./TriggerFields";
import { TriggerKind } from "../../../../entites/automation_v4/helpers/editorTypes";
import { ExpressionBuilderModalProps } from "../expressionBuilder/StartBlock";

interface TriggerEditorProps {
  triggers: Automation["trigger"];
  onChange: (triggers: Automation["trigger"]) => void;

  expressions: Automation["expressions"];
  onExpressionsChange: ExpressionBuilderModalProps["onExpressionsChange"];
  variables: ExpressionBuilderModalProps["variables"];
  capabilities: ExpressionBuilderModalProps["capabilities"];
}

function createTrigger(kind: TriggerKind): AutomationTrigger {
  if (kind === "device") {
    return {
      type: "device",
      device: "",
      field: "",
      condition: null,
    };
  }

  if (kind === "room") {
    return {
      type: "room",
      room: "",
      device_type: "",
      field: "",
      condition: null,
    };
  }

  return {
    type: "time",
    kind: "weekly",
    at: "08:00",
    weekdays: [0, 1, 2, 3, 4],
  };
}

export function TriggerEditor({
  triggers,
  onChange,
  expressions,
  onExpressionsChange,
  variables,
  capabilities
}: TriggerEditorProps) {
  const [addTriggerDialogVisible, setAddTriggerDialogVisible] =
    useState<boolean>(false);

  function addTrigger(kindToAdd: TriggerKind) {
    onChange([...triggers, createTrigger(kindToAdd)]);
  }

  function updateTrigger(index: number, nextTrigger: AutomationTrigger) {
    onChange(
      triggers.map((currentTrigger, currentIndex) =>
        currentIndex === index
          ? nextTrigger
          : currentTrigger,
      ),
    );
  }

  function removeTrigger(index: number) {
    onChange(
      triggers.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  return (
    <section className="automation-settings__section">
      <div className="automation-settings__row">
        <label>Триггеры запуска</label>

        <span className="automation-editor__step-count">
          {triggers.length}
        </span>
      </div>

      {triggers.length === 0 && (
        <div className="automation-settings__empty">
          <span>Триггеры не добавлены</span>
          <p>
            Добавьте событие устройства, комнаты или расписание.
          </p>
        </div>
      )}

      <div className="automation-trigger-list">
        {triggers.map((trigger, index) => (
          <div
            className="automation-trigger-item"
            key={`${trigger.type}-${index}`}
          >
                <ContentBox 
                label={
                    trigger.type === "device"? "Триггер устройства":
                    trigger.type === "room"? "Триггер комнаты":
                    trigger.type === "time"? "Временной триггер":""}
                border collapsible defaultVisible
                >

              <TriggerFields
                trigger={trigger}
                onChange={(nextTrigger) => updateTrigger(index, nextTrigger)}
                expressions={expressions}
                onExpressionsChange={onExpressionsChange}
                variables={variables}
                capabilities={capabilities}
              />

              <div style={{ marginTop: 12 }}>
                <Button type="button" onClick={() => removeTrigger(index)}>
                  Удалить триггер
                </Button>
              </div>
           
            </ContentBox>

          </div>
        ))}
      </div>

      <div className="automation-add-step">
        <Button onClick={()=>setAddTriggerDialogVisible(true)}>добавить триггер</Button>
      </div>
      {
        addTriggerDialogVisible && 
            <AddTrigger onHide={()=>setAddTriggerDialogVisible(false)} onSuccess={addTrigger}/>
      }
    </section>
  );
}