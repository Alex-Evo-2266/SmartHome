import { 
  BaseActionCard, BasicTemplateDialog, Button, NumberField, SelectionDialog, TextField 
} from "alex-evo-sh-ui-kit";
import { DialogPortal, SelectField } from "../../../shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../shared/lib/hooks/redux";
import { ActionItem, SetType } from "../../../entites/automation";
import { TypeDeviceField } from "../../../entites/devices";
import { Script, useScriptAPI } from "../../../entites/script";

interface AddActionProps {
  onHide: () => void;
  onSave: (data: ActionItem) => void;
}

interface CustomStep {
  key: string;
  label: string;
  type: "custom";
  render: (vals: Record<string,string>, setVal:(k:string,v:string)=>void) => JSX.Element | null;
}

interface SelectStep {
  key: string;
  label: string;
  type: "select"
  getItems: (vals: Record<string,string>) => { title: string; data: string }[];
}

type Step = CustomStep | SelectStep;

export const AddAction: React.FC<AddActionProps> = ({ onHide, onSave }) => {
  const { devicesData } = useAppSelector((state) => state.devices);
  const { getScripts } = useScriptAPI();
  const [scripts, setScripts] = useState<Script[]>([]);

  const [service, setService] = useState("device");
  const [values, setValues] = useState<Record<string,string>>({});
  const [openStep, setOpenStep] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      const res = await getScripts();
      setScripts(res.scripts);
    })();
  },[getScripts]);

  /** Универсальная конфигурация шагов */
  const SERVICE_CONFIG: Record<string, { steps: Step[] }> = {
    delay: {
      steps: [
        {
          key: "data",
          label: "Delay (ms)",
          type: "custom",
          render: (vals,setVal) => (
            <NumberField 
              placeholder="Delay" 
              border 
              min={0} 
              max={1000} 
              value={Number(vals.data||0)}
              onChange={(v:number)=>setVal("data",String(v))}
            />
          )
        }
      ]
    },
    device: {
      steps: [
        {
          key: "object",
          label: "Device",
          type: "select",
          getItems: () => devicesData.map(d=>({title:d.name,data:d.system_name}))
        },
        {
          key: "field",
          label: "Field",
          type: "select",
          getItems: (vals) => {
            const dev = devicesData.find(d=>d.system_name===vals.object);
            return dev?.fields?.map(f=>({title:f.name,data:f.name})) ?? [];
          }
        },
        {
          key: "data",
          label: "Data",
          type: "custom",
          render: (vals,setVal) => {
            const dev = devicesData.find(d=>d.system_name===vals.object);
            const field = dev?.fields?.find(f=>f.name===vals.field);
            if(!field) return null;
            if(field.type===TypeDeviceField.ENUM){
              return (
                <SelectField 
                  placeholder="Data" 
                  border 
                  value={vals.data||""}
                  items={field.enum_values?.split(",").map(x=>x.trim())||[]} 
                  onChange={v=>setVal("data",v)}
                />
              );
            }
            if(field.type===TypeDeviceField.BINARY){
              return (
                <SelectField 
                  placeholder="Data"
                  border 
                  value={vals.data||""}
                  items={[
                    {title:"on",value:"1"},
                    {title:"off",value:"0"},
                    {title:"target",value:"target"}
                  ]}
                  onChange={v=>setVal("data",v)}
                />
              );
            }
            if(field.type===TypeDeviceField.NUMBER){
              return (
                <NumberField 
                  placeholder="Data" 
                  border 
                  min={Number(field.low)} 
                  max={Number(field.high)}
                  value={Number(vals.data||0)}
                  onChange={(v:number)=>setVal("data",String(v))}
                />
              );
            }
            return (
              <TextField 
                placeholder="Data" 
                border 
                value={vals.data||""}
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setVal("data",e.target.value)}
              />
            );
          }
        }
      ]
    },
    script: {
      steps: [
        {
          key: "object",
          label: "Script",
          type: "select",
          getItems: () => scripts.map(s=>({title:s.name,data:s.id}))
        }
      ]
    }
  };

  const currentConfig = SERVICE_CONFIG[service];

  const handleStepSelect = (key:string,value:string) => {
    // при выборе шага очищаем все последующие
    const stepIndex = currentConfig.steps.findIndex(s=>s.key===key);
    const cleared = Object.fromEntries(
      Object.entries(values)
        .filter(([k]) => currentConfig.steps.findIndex(s=>s.key===k) <= stepIndex)
    );
    setValues({...cleared,[key]:value});
    setOpenStep(null);
  };

  const setVal = (k:string,v:string) => {
    setValues(prev=>({...prev,[k]:v}));
  };

  const isValid = useMemo(()=>{
    if(service==="delay") return !!values.data;
    if(service==="device") return !!values.object && !!values.field && !!values.data;
    if(service==="script") return !!values.object;
    return false;
  },[service,values]);

  const save = useCallback(() => {
    if (!isValid) return;

    const steps = SERVICE_CONFIG[service].steps;

    // формируем action по порядку шагов, пропуская пустые значения
    const actionValue = steps
      .map(step => step.key === "data"? null: values[step.key])
      .filter(Boolean)
      .join(".");

    onSave({
      service,
      action: actionValue,
      data: values.data || "",
      type_set: SetType.DATA
    });

    setTimeout(onHide, 0);
  }, [service, values, isValid, onSave]);

  return (
    <>
      <BasicTemplateDialog
        header="Select Action"
        onHide={onHide}
        action={
          <BaseActionCard>
            <Button styleType="text" onClick={onHide}>Cancel</Button>
            <Button styleType="text" onClick={save} disabled={!isValid}>Save</Button>
          </BaseActionCard>
        }
      >
        <div style={{ padding:"10px" }}>
          <SelectField 
            onChange={v=>{
              setService(v);
              setValues({});
            }}
            value={service}
            border 
            items={Object.keys(SERVICE_CONFIG)} 
            placeholder="Service"
          />
          {currentConfig.steps.map(step=>
            step.type==="custom"
              ? <div key={step.key}>{step.render(values,setVal)}</div>
              : (
                <TextField 
                  key={step.key}
                  placeholder={step.label}
                  border 
                  readOnly 
                  value={values[step.key]||""}
                  onClick={()=>setOpenStep(step.key)}
                />
              )
          )}
        </div>
      </BasicTemplateDialog>

      {currentConfig.steps.map(step=>
        step.type==="custom" ? null : (
          openStep===step.key && (
            <DialogPortal key={step.key}>
              <SelectionDialog 
                header={`Select ${step.label}`}
                items={step.getItems(values)}
                onHide={()=>setOpenStep(null)}
                onSuccess={val=>handleStepSelect(step.key,val)}
              />
            </DialogPortal>
          )
        )
      )}
    </>
  );
};
