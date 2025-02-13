import React, { useCallback, useState } from "react";
import { ConditionType, Automation, TriggerItem, ConditionItem, ActionItem } from "../../../entites/automation/models/automation";
import { BaseActionCard, Button, ContentBox, FullScrinTemplateDialog, IconButton, ListContainer, ListItem, TextField, Trash } from "alex-evo-sh-ui-kit";
import { DialogPortal, SelectField } from "../../../shared";
import { AddTrigger } from "./AddTrigger";
import { AddCondition } from "./AddCondition";
import { AddAction } from "./AddAction";

interface AutomationEditorProps {
  automation: Automation;
  onSave: (updatedAutomation: Automation) => void;
  onHide: () => void;
}

export const AutomationEditor: React.FC<AutomationEditorProps> = ({ automation, onSave, onHide }) => {
  const [formData, setFormData] = useState<Automation>(automation);
  const [addTrigger, setAddTrigger] = useState(false);
  const [addCondition, setAddCondition] = useState(false);
  const [addAction, setAddAction] = useState<null | "then" | "else_branch">(null);

  const handleChange = <K extends keyof Automation>(field: K, value: Automation[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onHide();
  };

  const addTriggerHandler = useCallback((data: TriggerItem) => {
    setFormData(prev => ({ ...prev, trigger: [...prev.trigger, data] }));
    setAddTrigger(false);
  }, []);

  const deleteTriggerHandler = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, trigger: prev.trigger.filter((_, i) => i !== index) }));
  }, []);

  const addConditionHandler = useCallback((data: ConditionItem) => {
    setFormData(prev => ({ ...prev, condition: [...prev.condition, data] }));
    setAddCondition(false);
  }, []);

  const deleteConditionHandler = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, condition: prev.condition.filter((_, i) => i !== index) }));
  }, []);

  const addActionHandler = useCallback((data: ActionItem, branch: "then" | "else_branch") => {
    setFormData(prev => ({ ...prev, [branch]: [...prev[branch], data] }));
    setAddAction(null);
  }, []);

  const deleteActionHandler = useCallback((index: number, branch: "then" | "else_branch") => {
    setFormData(prev => ({ ...prev, [branch]: prev[branch].filter((_, i) => i !== index) }));
  }, []);

  return (
    <FullScrinTemplateDialog header="Edit Automation" onHide={onHide} onSave={handleSave}>
      {addTrigger && (
        <DialogPortal>
          <AddTrigger onHide={() => setAddTrigger(false)} onSave={addTriggerHandler} />
        </DialogPortal>
      )}
      {addCondition && (
        <DialogPortal>
          <AddCondition onHide={() => setAddCondition(false)} onSave={addConditionHandler} />
        </DialogPortal>
      )}
      {addAction && (
        <DialogPortal>
          <AddAction onHide={() => setAddAction(null)} onSave={data => addActionHandler(data, addAction)} />
        </DialogPortal>
      )}
      <div style={{ padding: "0 10px" }}>
        <TextField
          border
          type="text"
          placeholder="Name Automation"
          onChange={e => handleChange("name", e.target.value)}
          value={formData.name}
        />
        <ContentBox label="Trigger" hiding border className="edit-automation-box">
          <ListContainer transparent>
            {formData.trigger.map((item, index) => (
              <ListItem
                key={index}
                hovered
                header={`${item.service}.${item.object}.${item.data}`}
                control={<IconButton icon={<Trash />} onClick={() => deleteTriggerHandler(index)} />}
              />
            ))}
          </ListContainer>
          <BaseActionCard>
            <Button onClick={() => setAddTrigger(true)}>+ Add</Button>
          </BaseActionCard>
        </ContentBox>

        <ContentBox label="Condition" hiding border className="edit-automation-box">
          <SelectField
            placeholder="Condition Type"
            border
            items={Object.values(ConditionType).map(item => ({ title: item, value: item }))}
            value={formData.condition_type}
            onChange={val => handleChange("condition_type", val as ConditionType)}
          />
          <ListContainer transparent>
            {formData.condition.map((item, index) => (
              <ListItem
                key={index}
                hovered
                header={`${item.arg1_service}.${item.arg1_object}.${item.arg1_data} ${item.operation} ${item.arg2_service}.${item.arg2_object}.${item.arg2_data}`}
                control={<IconButton icon={<Trash />} onClick={() => deleteConditionHandler(index)} />}
              />
            ))}
          </ListContainer>
          <BaseActionCard>
            <Button onClick={() => setAddCondition(true)}>+ Add</Button>
          </BaseActionCard>
        </ContentBox>

        {(["then", "else_branch"] as const).map(branch => (
          <ContentBox key={branch} label={branch} hiding border className="edit-automation-box">
            <ListContainer transparent>
              {formData[branch].map((item, index) => (
                <ListItem
                  key={index}
                  hovered
                  header={`${item.service}.${item.object}.${item.field} = ${item.data}`}
                  control={<IconButton icon={<Trash />} onClick={() => deleteActionHandler(index, branch as "then" | "else_branch")} />}
                />
              ))}
            </ListContainer>
            <BaseActionCard>
              <Button onClick={() => setAddAction(branch as "then" | "else_branch")}>+ Add</Button>
            </BaseActionCard>
          </ContentBox>
        ))}
      </div>
    </FullScrinTemplateDialog>
  );
};
