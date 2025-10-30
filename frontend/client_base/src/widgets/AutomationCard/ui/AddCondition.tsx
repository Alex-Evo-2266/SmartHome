import { BaseActionCard, BasicTemplateDialog, Button, NumberField, SelectionDialog, TextField } from "alex-evo-sh-ui-kit";
import { useState, useCallback, useMemo } from "react";

import { ConditionItem, Operation } from '../../../entites/automation';
import { TypeDeviceField } from "../../../entites/devices";
import { DeviceFieldType, useRooms } from "../../../entites/rooms";
import { DialogPortal, SelectField } from "../../../shared";
import { splitEnum } from "../../../shared/lib/helpers/enumStrimg";
import { useAppSelector } from "../../../shared/lib/hooks/redux";

type TypesField = {type:"number" | "text" | "bool" | "enum" | "any", option?: string[]}

interface CustomStep {
  key: string;
  label: string;
  type: "custom";
  render: (vals:Record<string,string>, arg:"arg1"|"arg2", type:TypesField)=>JSX.Element;
}

interface SelectStep {
  key: string;
  label: string;
  type: "select";
  getItems: (vals:Record<string,string>, arg:"arg1"|"arg2", type:TypesField) => { title: string; data: string }[];
}

type Step = CustomStep | SelectStep;

interface ArgInfo{
  steps: Step[];
  type_arg: (vals:Record<string,string>, arg:"arg1"|"arg2")=>TypesField;
}

type IArg = Record<string, ArgInfo>;

function types_automation_to_type_device(type:TypesField){
  return type.type==="bool" ? [TypeDeviceField.BINARY] :
    type.type==="enum" ? [TypeDeviceField.TEXT,TypeDeviceField.ENUM] :
    type.type==="number" ? [TypeDeviceField.NUMBER] :
    [TypeDeviceField.ENUM,TypeDeviceField.TEXT,TypeDeviceField.COUNTER];
}

function types_device_to_type_automation(type?:TypeDeviceField, enum_option?: string | null):TypesField{
  if(!type) return {type:"any"};
        if(type===TypeDeviceField.BINARY) return {type:"bool"};
        if(type===TypeDeviceField.NUMBER || type === TypeDeviceField.COUNTER) return {type:"number"};
        if(type===TypeDeviceField.ENUM) return enum_option !== undefined && enum_option !== null?{type:"enum", option:splitEnum(enum_option??"")}:{type:"text"};
        if([TypeDeviceField.TEXT].includes(type)) return {type: "text"}
        return {type:"any"};
}



export const AddCondition: React.FC<{onHide:()=>void; onSave:(d:ConditionItem)=>void}> = ({onHide,onSave})=>{
  const { devicesData } = useAppSelector(state=>state.devices);
  const { rooms } = useRooms();
  
  const [values,setValues] = useState<Record<string,string>>({arg1_service:"device",arg2_service:"device"});
  const [openStep,setOpenStep] = useState<string|null>(null);
  const [operation,setOperation] = useState<Operation>(Operation.EQUAL);

  const handleStepSelect = useCallback((key:string,value:string)=>{
    setValues(prev => {
        const n = { ...prev, [key]: value };
        if(key.startsWith("arg1"))
            return Object.fromEntries(
                Object.entries(n).filter(([k]) => !k.startsWith("arg2"))
            );
        return n
    });
    setOpenStep(null);
  },[]);

  // --- CONFIG ---
  const SERVICE_STEPS: IArg = useMemo(()=>({
    device:{
      steps:[
        {
          key:"object",
          label:"Device",
          type:"select",
          getItems(){
            return devicesData.map(i=>({title:i.name,data:i.system_name}));
          }
        },
        {
          key:"field",
          label:"Field",
          type:"select",
          getItems(vals,arg,type){
            const device = devicesData.find(i=>i.system_name===vals[`${arg}_object`]);
            const typesField = types_automation_to_type_device(type)
            if(type.type === "any")
                return device?.fields?.map(f=>({title:f.name,data:f.id})) ?? [];
            return device?.fields
              ?.filter(f=>typesField.includes(f.type))
              .map(f=>({title:f.name,data:f.id})) ?? [];
          }
        }
      ],
      type_arg(vals,arg){
        const device = devicesData.find(i=>i.system_name===vals[`${arg}_object`]);
        const field = device?.fields?.find(i=>i.id===vals[`${arg}_field`]);
        return types_device_to_type_automation(field?.type, field?.enum_values)
      }
    },
    value:{
      steps:[
        {
          key:"val",
          label:"Value",
          type:"custom",
          render(vals,arg,type){
            if(type.type==="number")
              return <NumberField border placeholder="Value" value={Number(vals[`${arg}_val`]||0)} onChange={(v:number)=>handleStepSelect(`${arg}_val`,String(v))}/>;
            if(type.type==="bool")
              return <SelectField border items={[{title:"True",value:"true"},{title:"False",value:"false"}]} value={vals[`${arg}_val`]||""} onChange={v=>handleStepSelect(`${arg}_val`,v)}/>;
            if(type.type==="enum")
              return <SelectField border items={(type.option??[]).map(o=>({title:o,value:o}))} value={vals[`${arg}_val`]||""} onChange={v=>handleStepSelect(`${arg}_val`,v)}/>;
            return <TextField border placeholder="Value" value={vals[`${arg}_val`]||""} onChange={(value: string)=>handleStepSelect(`${arg}_val`,value)}/>;
          }
        }
      ],
      type_arg(){
        // если просто value — тип любой, от операции зависит
        return {type:"any"};
      }
    },
    room:{
      steps:[
        {
          key: "room_name",
          label: "Room",
          type: "select",
          getItems(){
            return rooms.map(i=>({title:i.name_room, data:i.name_room}))
          },
        },
        {
          key: "device",
          label: "Device",
          type: "select",
          getItems(vals, arg) {
            const room = rooms.find(i=>i.name_room === vals[`${arg}_room_name`])
            if(!room)
              return []
            return Object.keys(room.device_room).map(i=>({title: i, data: i}))
          },
        },
        {
          key: "field",
          label: "Field",
          type: "select",
          getItems(vals, arg, type) {
            const room = rooms.find(i=>i.name_room === vals[`${arg}_room_name`])
            const dev_name = vals[`${arg}_device`]
            const dev = room?.device_room[dev_name]
            if(!dev)
              return []
            if(type.type === "any")
            { 
              return Object.keys(dev.fields).map(i=>({title: i, data: i}))
            }
            const field_types = types_automation_to_type_device(type)
            const filtered = Object.keys(dev.fields).reduce((acc, key) => {
              if (field_types.includes(dev.fields[key].field_type)) acc[key] = dev.fields[key];
              return acc;
            }, {} as Record<string, DeviceFieldType>);
            return Object.keys(filtered).map(i=>({title:i, data:i}))
          },
        }
      ],
      type_arg(vals, arg) {
        const room = rooms.find(i=>i.name_room === vals[`${arg}_room_name`])
        const dev_name = vals[`${arg}_device`]
        const field_name = vals[`${arg}_field`]
        const type = room?.device_room[dev_name]?.fields[field_name]?.field_type
        return types_device_to_type_automation(type)
      },
    }
  }),[rooms, handleStepSelect, devicesData]) 
  


  const renderSteps = useCallback((arg:"arg1"|"arg2")=>{
    const arg_other = arg === "arg1"?"arg2":"arg1"
    const service_other = values[`${arg_other}_service`] as keyof IArg;
    const service = values[`${arg}_service`] as keyof IArg;
    const cfg_other = SERVICE_STEPS[service_other];
    const cfg = SERVICE_STEPS[service];
    if(!cfg) return null;
    const type:TypesField = arg === "arg1"?{type: "any"}:cfg_other.type_arg(values,arg_other);
    return cfg.steps.map(step=>{
      const vkey = `${arg}_${step.key}`;
      if(step.type==="select"){
        const val = values[vkey]||"";
        return (
          <TextField 
            key={vkey} 
            border 
            readOnly 
            placeholder={step.label} 
            value={val}
            onClick={()=>setOpenStep(vkey)}
          />
        );
      }
      if(step.type==="custom"){
        return <div key={vkey}>{step.render(values,arg,type)}</div>;
      }
      return null;
    });
  },[values, SERVICE_STEPS])

  const renderDialogs = useCallback((arg:"arg1"|"arg2")=>{
    const arg_other = arg === "arg1"?"arg2":"arg1"
    const service = values[`${arg}_service`] as keyof IArg;
    const service_other = values[`${arg_other}_service`] as keyof IArg;
    const cfg = SERVICE_STEPS[service];
    const cfg_other = SERVICE_STEPS[service_other];
    if(!cfg) return null;
    const type:TypesField = arg === "arg1"?{type: "any"}:cfg_other.type_arg(values,arg_other);
    return cfg.steps.map(step=>{
      const vkey = `${arg}_${step.key}`;
      if(openStep===vkey && step.type==="select"){
        const items = step.getItems(values,arg,type);
        return (
          <DialogPortal key={vkey}>
            <SelectionDialog 
              header={`Select ${step.label}`}
              items={items}
              onHide={()=>setOpenStep(null)}
              onSuccess={val=>handleStepSelect(vkey,val)}
            />
          </DialogPortal>
        );
      }
      return null;
    });
  },[values, SERVICE_STEPS, openStep, handleStepSelect])

    const save = () => {
        const buildArg = (prefix: "arg1" | "arg2", serviceKey: string) => {
            const service = SERVICE_STEPS[serviceKey];
            if (!service) return "";
            return service.steps
            .map(step => values[`${prefix}_${step.key}`]) // строго по steps
            .filter(Boolean)
            .join(".");
        };

        const arg1 = buildArg("arg1", values.arg1_service);
        const arg2 = buildArg("arg2", values.arg2_service);

        if (arg1 && arg2) {
            onSave({
            arg1_service: values.arg1_service,
            arg2_service: values.arg2_service,
            arg1,
            arg2,
            operation,
            });
        }
    };


  const items = Object.keys(SERVICE_STEPS)

  return (
    <>
      <BasicTemplateDialog header="Select condition" onHide={onHide} action={
        <BaseActionCard>
          <Button styleType="text" onClick={onHide}>cancel</Button>
          <Button styleType="text" onClick={save}>save</Button>
        </BaseActionCard>
      }>
        <div style={{padding:"10px"}}>
            <SelectField border value={values.arg1_service} items={items} onChange={(value)=>handleStepSelect("arg1_service", value)}/>
          {renderSteps("arg1")}
        </div>
        <div style={{padding:"10px"}}>
          <SelectField border items={Object.values(Operation).map(o=>({title:o,value:o}))} value={operation} onChange={v=>setOperation(v as Operation)} />
        </div>
        <div style={{padding:"10px"}}>
            <SelectField border value={values.arg2_service} items={items} onChange={(value)=>handleStepSelect("arg2_service", value)}/>
          {renderSteps("arg2")}
        </div>
      </BasicTemplateDialog>
      {renderDialogs("arg1")}
      {renderDialogs("arg2")}
    </>
  );
};
