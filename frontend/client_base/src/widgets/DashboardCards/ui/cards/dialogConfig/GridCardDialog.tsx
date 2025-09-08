import { ControlElement, DashboardCardGrid, TypeControlElements } from "@src/entites/dashboard/models/panel"
import { BaseActionCard, BaseDialog, BasicTemplateDialog, Button, Checkbox, ColorContext, IColorContext, IconButton, IconsSelect, ListContainer, ListItem, NumberField, RadioButton, SelectField, SelectionDialog, TextField, Trash } from "alex-evo-sh-ui-kit"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import './style.scss'
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { Script, useScriptAPI } from "@src/entites/script"
import { useRooms } from "@src/entites/rooms"
import { TypeDeviceField } from "@src/entites/devices"
import { MODAL_ROOT_ID } from "@src/const"
import { splitEnum } from "@src/shared/lib/helpers/enumStrimg"
import { getConfigRoomField } from "@src/features/Room"

interface IGridCardDialog{
    onHide: () => void
    data: DashboardCardGrid
    onSave: (data: DashboardCardGrid) => void
}

export const GridCardDialog:React.FC<IGridCardDialog> = ({onHide, data, onSave }) => {

    const [items, setItems] = useState<ControlElement[]>(data.items ?? [])
    const [addDialogVisible, setAddDialogVisible] = useState(false)
    const [editDialogVisible, setEditDialogVisible] = useState<null | number>(null)
    const [deleteDislog, setDeleteDislog] = useState<number | null>(null)

    const hide = () => {
        onHide()
    }

    const newElement = (data: ControlElement) => {
        setItems(prev=>[...prev, data])
        setAddDialogVisible(false)
    }

    const editElement = (data: ControlElement, index: number) => {
        setItems(prev=>{
          const arr = prev.slice()
          arr[index] = data
          return arr
        })
        setEditDialogVisible(null)
    }

    const save = () => {
        onSave({...data, items: items})
    }

    const deleteElement = (index: number) => {
        setItems(prev=>prev.filter((_, index2)=>index !== index2))
    }

    return(
        <>
        {
        editDialogVisible !== null?
        <AddControlDialog onHide={()=>setEditDialogVisible(null)} onSave={data=>editElement(data, editDialogVisible)} oldData={items[editDialogVisible]}/>:
        addDialogVisible?
        <AddControlDialog onHide={()=>setAddDialogVisible(false)} onSave={newElement}/>:
        <BasicTemplateDialog onHide={hide}>
            <ListContainer transparent>
            {
                items.map((item, index)=>(
                    <ListItem hovered onClick={()=>setEditDialogVisible(index)} header={item.type} control={<IconButton icon={<Trash/>} onClick={()=>setDeleteDislog(index)}/>}/>
                ))
            }
            </ListContainer>
            <BaseActionCard>
              <Button styleType="text" onClick={()=>setAddDialogVisible(true)}>add</Button>
              <Button onClick={save}>save</Button>
            </BaseActionCard>
            
            
        </BasicTemplateDialog>
        }
        {
            deleteDislog !== null && <BaseDialog header="delete element" text="delete element" onHide={()=>setDeleteDislog(null)} onSuccess={()=>deleteElement(deleteDislog)}/>
        }
        </>
    )
}

interface IAddControlDialog{
    onSave: (data:ControlElement) => void
    onHide: () => void
    oldData?: ControlElement
}

const ELEMENTS_TYPE:TypeControlElements[] = [
    "bool",
    "enum",
    "number",
    "text",
    "button"
]

const ELEMENTS_TYPE_MAP: Record<TypeControlElements, TypeDeviceField> = {
  "bool": TypeDeviceField.BINARY,
  "enum": TypeDeviceField.ENUM,
  "number": TypeDeviceField.NUMBER,
  "text": TypeDeviceField.TEXT,
  "button": TypeDeviceField.BASE
}

const AddControlDialog:React.FC<IAddControlDialog> = ({onHide, onSave, oldData}) => {

    const {colors} = useContext<IColorContext>(ColorContext)
    const [type, setType] = useState<TypeControlElements>(oldData?.type ?? "bool")
    const [readonly, setReadonly] = useState<boolean>(oldData?.readonly ?? false)
    const [data, setData] = useState<string>(oldData?.data ?? "")
    const [width, setWidth] = useState<1 | 2 | 3 | 4>(oldData?.width ?? 2)
    const [title, setTitle] = useState<string>(oldData?.title ?? "")
    const [icon, setIcon] = useState<string>(oldData?.icon ?? "")
    const [selectData, setSelectData] = useState<TypeControlElements | null>(null)

    const changeType = (e:React.ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value as TypeControlElements)
        setData("")
    }

    const changeReadonly = (e:React.ChangeEvent<HTMLInputElement>) => {
        setReadonly(e.target.checked)
    }

    const changeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const save = () => {
        onSave({type, readonly, data, width, title, icon})
    }

    if(selectData !== null)
    {
        return <DataSelect onHide={()=>setSelectData(null)} onSave={setData} type={type}/>
    }
    
    return(
        <BasicTemplateDialog onHide={onHide} style={{background: colors.Surface_container_low_color}}>
            <div>
                <TextField border placeholder="title" value={title} onChange={changeTitle}/>
                <div className="flex-column">
                {
                    ELEMENTS_TYPE.map((item, index)=>(
                        <RadioButton onChange={changeType} checked={type === item} name="type_element" value={item} key={index} label={item} showLabel/>
                    ))
                }
                <label style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBlockStart: '10px' }}>
                    <Checkbox name="readonly" checked={readonly} onChange={changeReadonly}/>
                    <span>readonly</span>
                </label>
                </div>
                <NumberField value={width} placeholder="width" min={1} max={4} onChange={(value:number)=>setWidth(value as 1 | 2 | 3 | 4)} border/>
                <IconsSelect placeholder="icon" onChange={setIcon} value={icon} container={document.getElementById(MODAL_ROOT_ID)}/>
                <TextField placeholder="data" value={data} disabled border/>
                <div className="flex-column">
                    <Button styleType="text" style={{marginBlockEnd: '10px'}} onClick={()=>setSelectData(type)}>data select</Button>
                    <Button styleType="filled" style={{marginBlockEnd: '10px'}} onClick={save} disabled={data === ""}>save</Button>
                </div>
            </div>
        </BasicTemplateDialog>
    )
}

interface AddActionProps {
  onHide: () => void;
  onSave: (data: string) => void;
  type: TypeControlElements
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

export const DataSelect: React.FC<AddActionProps> = ({ onHide, onSave, type }) => {
  const { devicesData } = useAppSelector((state) => state.devices);
  const { getScripts } = useScriptAPI();
  const [scripts, setScripts] = useState<Script[]>([]);
  const { rooms } = useRooms();

  const [service, setService] = useState("device");
  const [values, setValues] = useState<Record<string,string>>({});
  const [openStep, setOpenStep] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      const res = await getScripts();
      setScripts(res.scripts);
    })();
  },[getScripts]);

  const filterFields = (typeElement:TypeControlElements, typeDev: TypeDeviceField) => {
    if(typeElement === "button")
    {
      return true
    }
    return ELEMENTS_TYPE_MAP[typeElement] === typeDev
  }

  const baseConfig: Record<string, { steps: Step[] }> = {
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
          return dev?.fields?.filter(item=>filterFields(type, item.type)).map(f=>({title:f.name,data:f.name})) ?? [];
        }
      },
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
  },
  room: {
    steps: [
      {
        key: "room",
        label: "Room",
        type: "select",
        getItems() {
          return rooms.map(i=>({data:i.name_room, title: i.name_room}))
        },
      },
      {
        key: "device",
        label: "Device",
        type: "select",
        getItems(vals) {
          const room = rooms.find(i=>i.name_room === vals.room)
          if(!room) return []
          return Object.keys(room.device_room).map(i=>({title: i, data: i}))
        },
      },
      {
        key: "field",
        label: "Field",
        type: "select",
        getItems(vals) {
          const room = rooms.find(i=>i.name_room === vals.room)
          const dev_name = vals.device
          const dev = room?.device_room[dev_name]
          if(!dev) return []
          return Object.entries(dev.fields).filter(i=>filterFields(type, i[1].field_type)).map(i=>({title: i[0], data: i[0]}))
        },
      }
    ]
  }
}

interface TypeFieldText{
  type: "text"
}

interface TypeFieldNumber{
  type: "number",
  option: number[]
}

interface TypeFieldEnum{
  type: "enum",
  option: string[]
}

type TypeField = TypeFieldText | TypeFieldNumber | TypeFieldEnum

// теперь модифицируем для кнопки
const SERVICE_CONFIG: Record<string, { steps: Step[] }> = useMemo(()=>{
  if (type === "button") {
    return {
      ...baseConfig,
      device: {
        steps: [
          ...baseConfig.device.steps,
          {
            key: "button_value",
            label: "Button Value",
            type: "custom",
            render: (vals,setVal) => {
              const dev = devicesData.find(d=>d.system_name===vals.object);
              const field = dev?.fields?.find(i=>i.name === vals.field)
              let typeField:TypeField = {type: "text"}
              if(field !== undefined)
              {
                if(field.type === TypeDeviceField.NUMBER)
                {
                  let option = []
                  if(field.low)
                    option[0] = Number(field.low)
                  else
                    option[0] = 0
                  if(field.high)
                    option[1] = Number(field.high)

                  typeField = {type: "number", option}
                }
                else if(field.type === TypeDeviceField.BINARY)
                  typeField = {type: "enum", option: ["true", "false"]}
                else if(field.type === TypeDeviceField.ENUM)
                  typeField = {type: "enum", option: field.enum_values?splitEnum(field.enum_values):[]}
              }
              if(typeField.type === "number")
                return(
                  <NumberField onChange={(value: number) => setVal("button_value", String(value))} placeholder="Value to apply when pressed" border max={Number(typeField.option[1])} min={Number(typeField.option[0])} value={Number(vals.button_value || 0)}/>
              )
              if(typeField.type === "enum")
                return(
                  <SelectField onChange={(value: string) => setVal("button_value", value)} placeholder="Value to apply when pressed" border items={typeField.option} value={vals.button_value || ""}/>
              )
              return(<TextField
                border
                placeholder="Value to apply when pressed"
                value={vals.button_value || ""}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setVal("button_value", e.target.value)}
              />)
            }
          }
        ]
      },
      room: {
        steps: [
          ...baseConfig.room.steps,
          {
            key: "button_value",
            label: "Button Value",
            type: "custom",
            render: (vals,setVal) => {
              const room = rooms.find(i=>i.name_room === vals.room)
              const dev_name = vals.device
              const dev = room?.device_room[dev_name]
              const field = dev?Object.entries(dev.fields).find(i=>i[0] === vals.field):undefined
              const conf = getConfigRoomField(field?.[1], devicesData)
              let typeField:TypeField = {type: "text"}
              if(field !== undefined)
              {
                if(conf.type === TypeDeviceField.NUMBER)
                {
                  typeField = {type: "number", option: [conf.min ?? 0, conf.max ?? 100]}
                }
                else if(conf.type === TypeDeviceField.BINARY)
                  typeField = {type: "enum", option: ["true", "false"]}
                else if(conf.type === TypeDeviceField.ENUM)
                  typeField = {type: "enum", option: conf.enum}
              }
              if(typeField.type === "number")
                return(
                  <NumberField onChange={(value: number) => setVal("button_value", String(value))} placeholder="Value to apply when pressed" border max={Number(typeField.option[1])} min={Number(typeField.option[0])} value={Number(vals.button_value || 0)}/>
              )
              if(typeField.type === "enum")
                return(
                  <SelectField onChange={(value: string) => setVal("button_value", value)} placeholder="Value to apply when pressed" border items={typeField.option} value={vals.button_value || ""}/>
              )
              return(<TextField
                border
                placeholder="Value to apply when pressed"
                value={vals.button_value || ""}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setVal("button_value", e.target.value)}
              />)
            }
          }
        ]
      },
      script: baseConfig.script // для скрипта значение не нужно
    }
  }
  return baseConfig
},[type,devicesData,rooms,scripts])

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
    if(service==="device") return !!values.object && !!values.field;
    if(service==="script") return !!values.object;
    if(service==="room") return !!values.room && !!values.device && !!values.field;
    return false;
  },[service,values]);

  const save = useCallback(() => {
    if (!isValid) return;

    onSave([service, ...Object.values(values)].join("."));

    setTimeout(onHide, 0);
  }, [service, values, isValid, onSave]);

  const stepVisible = currentConfig.steps.find(step=>step.type!=="custom" && openStep===step.key)

  return (
    <>
    {
        stepVisible && stepVisible.type !== "custom"?
        <SelectionDialog 
            header={`Select ${stepVisible.label}`}
            items={stepVisible.getItems(values)}
            onHide={()=>setOpenStep(null)}
            onSuccess={val=>handleStepSelect(stepVisible.key,val)}
        />:
        <BasicTemplateDialog
        header="Select data element"
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
            onChange={(v:string)=>{
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
    }
    </>
  );
};
