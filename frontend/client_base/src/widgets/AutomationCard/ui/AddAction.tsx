import { BaseActionCard, BasicTemplateDialog, Button, NumberField, SelectionDialog, TextField } from "alex-evo-sh-ui-kit";
import { DialogPortal, SelectField } from "../../../shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../shared/lib/hooks/redux";
import { ActionItem, SetType } from "../../../entites/automation";
import { TypeDeviceField } from "../../../entites/devices";
import { Script, useScriptAPI } from "../../../entites/script";

interface AddConditionProps {
  onHide: () => void;
  onSave: (data: ActionItem) => void;
}

const SERVICES = ["device", "delay", "script"];
const OBJECT_ENABLE = ["device", "script"];
const FIELD_ENABLE = ["device"];
const OBJECT_REQUIRED = ["device"];

export const AddAction: React.FC<AddConditionProps> = ({ onHide, onSave }) => {
  const [service, setService] = useState(SERVICES[0]);
  const [object, setObject] = useState("");
  const [field, setField] = useState("");
  const [data, setData] = useState("");

  const [script, setScript] = useState<Script[]>([])

  const [objectSearch, setObjectSearch] = useState(false);
  const [fieldSearch, setFieldSearch] = useState(false);

  const { devicesData } = useAppSelector((state) => state.devices);

  const {getScripts} = useScriptAPI()

  const getData = useCallback(async()=>{
    const data = await getScripts()
    setScript(data.scripts)
  },[getScripts])

  const dataConf = useMemo(() => {
    if (service === "delay") {
      return { type: "number", min: 0, max: 1000 };
    }
    if (service === "device") {
      const fieldCond = devicesData.find((item) => item.system_name === object)?.fields?.find((f) => f.name === field);
      if (!fieldCond) return { type: "none" };
      if (fieldCond.type === TypeDeviceField.ENUM)
        return { type: "select", items: fieldCond.enum_values?.split(",").map((item) => item.trim()) };
      if (fieldCond.type === TypeDeviceField.BINARY)
        return { type: "select", items: [
          { title: "on", value: "1" },
          { title: "off", value: "0" },
          { title: "target", value: "target" },
        ] };
      if (fieldCond.type === TypeDeviceField.NUMBER)
        return { type: "number", max: Number(fieldCond.high), min: Number(fieldCond.low) };
      return { type: "text" };
    }
  }, [service, object, field, devicesData]);

  const getObject = useMemo(
    () => (
      service === "device" ? devicesData.map((item) => ({ title: item.name, data: item.system_name })):
      service === "script" ? script.map(item=>({title: item.name, data: item.id})):
      []
    ),
    [service, devicesData]
  );

  const getField = useMemo(() => {
    if (service === "device") {
      return devicesData.find((item) => item.system_name === object)?.fields?.map((f) => ({ title: f.name, data: f.name })) || [];
    }
    return [];
  }, [service, object, devicesData]);

  const isValid = useMemo(() => {
    if (service === "delay") return data !== "";
    if (service === "device") return data !== "" && object !== "" && field !== "";
    if (service === "script") return object !== "";
    return false;
  }, [service, object, field, data]);

    const serviceHeandler = (value: string) => {
        setService(prev=>{
            prev != value && objectHeandler("")
            return value
        })
    }

    const objectHeandler = (value: string) => {
        setObject(prev=>{
            prev != value && fieldHeandler("")
            return value
        })
    }

    const fieldHeandler = (value: string) => {
        setField(prev=>{
            prev != value && DataHeandler("")
            return value
        })
    }

    const DataHeandler = (value: string) => {
        setData(value)
    }

  const save = useCallback(() => {
    if (isValid) {
      onSave({ service, object, field, data, type_set: SetType.DATA });
      setTimeout(onHide, 0);
    }
  }, [service, object, data, field, onSave, onHide, isValid]);

  useEffect(()=>{
    getData()
  },[getData])

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
        <div style={{ padding: "10px" }}>
          <SelectField onChange={serviceHeandler} value={service} border items={SERVICES} placeholder="Service" />
          {OBJECT_ENABLE.includes(service) && (
            <TextField placeholder="Object" border readOnly value={object} onClick={() => setObjectSearch(true)} />
          )}
          {FIELD_ENABLE.includes(service) && (object || !OBJECT_REQUIRED.includes(service)) && (
            <TextField placeholder="Field" border readOnly value={field} onClick={() => setFieldSearch(true)} />
          )}
          {dataConf?.type === "text" && (
            <TextField placeholder="Data" border value={data} onChange={(e) => setData(e.target.value)} />
          )}
          {dataConf?.type === "number" && (
            <NumberField placeholder="Data" max={dataConf.max} min={dataConf.min} border value={Number(data)} onChange={(value) => setData(String(value))} />
          )}
          {dataConf?.type === "select" && (
            <SelectField placeholder="Data" border items={dataConf.items ?? []} value={data} onChange={setData} />
          )}
        </div>
      </BasicTemplateDialog>
      {objectSearch && (
        <DialogPortal>
          <SelectionDialog header="Select Object" items={getObject} onHide={() => setObjectSearch(false)} onSuccess={objectHeandler} />
        </DialogPortal>
      )}
      {fieldSearch && (
        <DialogPortal>
          <SelectionDialog header="Select Field" items={getField} onHide={() => setFieldSearch(false)} onSuccess={fieldHeandler} />
        </DialogPortal>
      )}
    </>
  );
};