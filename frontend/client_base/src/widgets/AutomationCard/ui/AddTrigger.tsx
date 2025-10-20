import { 
  BaseActionCard, BasicTemplateDialog, Button, DayOfWeekField, SelectionDialog, TextField 
} from "alex-evo-sh-ui-kit";
import { DialogPortal, SelectField, TimeField } from "../../../shared";
import { useCallback, useState } from "react";
import { useAppSelector } from "../../../shared/lib/hooks/redux";
import { TriggerItem } from '../../../entites/automation';
import { DateTime } from 'luxon';
import { useRooms } from "../../../entites/rooms";

interface AddTriggerProps {
  onHide: ()=>void;
  onSave: (data: TriggerItem)=>void;
}

interface CustomStep {
  key: string;
  label: string;
  type: "custom";
  render: () => JSX.Element;
}

interface SelectStep {
  key: string;
  label: string;
  type: "select"
  getItems: (vals: Record<string,string>) => { title: string; data: string }[];
}

type Step = CustomStep | SelectStep;


function formatTimeWithOffset(hour: string, minutes: string): string {
  return DateTime.now().set({hour:parseInt(hour), minute:parseInt(minutes), second:0})
    .toFormat('HH:mm:ssZZ');
}

function getTime(time: string): string {
  const [h, m] = time.split(":");
  return `${h || "00"}:${m || "00"}`;
}

export const AddTrigger: React.FC<AddTriggerProps> = ({onHide, onSave}) => {
  const { devicesData } = useAppSelector(state => state.devices);
  const { rooms } = useRooms();

  const [service, setService] = useState("time");
  const [values, setValues] = useState<Record<string,string>>({});
  const [option, setOption] = useState("");
  const [openStep, setOpenStep] = useState<string|null>(null);

  /** Универсальная конфигурация */
  const SERVICE_CONFIG: Record<string, { steps: Step[] }> = {
    time: {
      steps: [
        {
          key: "time",
          label: "Time",
          type: "custom", // вместо выбора — кастомный UI
          render: () => (
            <>
              <DayOfWeekField 
                className="automation-week" 
                value={option.split(',').map(x=>x.trim()).filter(Boolean)} 
                onChange={data => setOption(data.filter(x=>x!=="").join(", "))} 
              />
              <TimeField 
                border 
                value={getTime(values.time || "")} 
                onChange={v => {
                  const [h, m] = v.split(":");
                  setValues(prev=>({...prev, time:formatTimeWithOffset(h,m)}));
                }} 
              />
            </>
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
          getItems: (vals:Record<string,string>) => {
            const dev = devicesData.find(d=>d.system_name===vals.object);
            return dev?.fields?.map(f=>({title:f.name,data:f.name})) ?? [];
          }
        }
      ]
    },
    room: {
      steps: [
        {
          key: "object",
          label: "Room",
          type: "select",
          getItems: () => rooms.map(r=>({title:r.name_room,data:r.name_room}))
        },
        {
          key: "deviceType",
          label: "Device type",
          type: "select",
          getItems: (vals:Record<string,string>) => {
            const room = rooms.find(i=>i.name_room === vals.object)
            if(!room)
                return []
            return Object.keys(room.device_room).map(i=>({title:i, data:i}));
          }
        },
        {
          key: "field",
          label: "Field",
          type: "select",
          getItems: (vals:Record<string,string>) => {
            const room = rooms.find(i=>i.name_room === vals.object)
            if(!room || !vals.deviceType)
                return []
            return Object.keys(room.device_room[vals.deviceType].fields).map(i=>({title:i, data:i}));
          }
        }
      ]
    }
  };

  const currentConfig = SERVICE_CONFIG[service as keyof typeof SERVICE_CONFIG];

  const handleStepSelect = (key:string,value:string) => {
    setValues(prev=>({...prev,[key]:value}));
    setOpenStep(null);
    // при смене шага очищаем последующие
    const stepIndex = currentConfig.steps.findIndex(s=>s.key===key);
    const cleared = Object.fromEntries(
      Object.entries(values)
        .filter(([k]) => currentConfig.steps.findIndex(s=>s.key===k) <= stepIndex)
    );
    setValues({...cleared,[key]:value});
  };

  const save = useCallback(() => {
    if(service==="time" && values.time){
      onSave({service, trigger: `${values.time}`, option});
      return 
    }
    if(service==="device" && values.object && values.field){
      onSave({service, trigger:`${values.object}.${values.field}`, option});
      return
    }
    if(service==="room" && values.object && values.deviceType && values.field){
      onSave({
        service, 
        trigger: `${values.object}.${values.deviceType}.${values.field}`,
        option
      });
      return
    }
  }, [service, values, option, onSave]);

  return (
    <>
      <BasicTemplateDialog 
        header="Select trigger"
        onHide={onHide}
        action={
          <BaseActionCard>
            <Button styleType="text" onClick={onHide}>cancel</Button>
            <Button styleType="text" onClick={save}>save</Button>
          </BaseActionCard>
        }
      >
        <div style={{padding:"10px"}}>
          <SelectField 
            onChange={v=>{
              setService(v);
              setValues({});
            }} 
            value={service} 
            border 
            items={Object.keys(SERVICE_CONFIG)} 
            placeholder="service"
          />

          {currentConfig.steps.map(step => 
            step.type==="custom" ? (
              <div key={step.key}>{step.render()}</div>
            ) : (
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

      {currentConfig.steps.map(step => (
        step.type==="custom" ? null : (
          openStep===step.key && (
            <DialogPortal key={step.key}>
              <SelectionDialog
                header={`Select ${step.label}`}
                items={step.getItems(values)}
                onHide={()=>setOpenStep(null)}
                onSuccess={(val)=>handleStepSelect(step.key,val)}
              />
            </DialogPortal>
          )
        )
      ))}
    </>
  );
};
