import { useState, useEffect, useCallback } from "react";
import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { Switch } from "alex-evo-sh-ui-kit";
import { useSendValue } from "../../api/sendValue";

function getInitData(high:string|null|undefined, value:string|null|undefined){
    if(!high && value == "1")
        return true
    if(high && value == high)
        return true
    return false  
}

function getData(high:string|null|undefined, low:string|null|undefined, value:string|null|undefined, old:boolean){
    if(!high && value == "1")
        return true
    if(high && value == high)
        return true
    if(!low && value == "0")
        return false
    if(low && value == low)
        return false
    return old
}

function getOutData(high:string|null|undefined, low:string|null|undefined, value:boolean){
    if(value && !high)
        return "1"
    if(value && high)
        return high
    if(!value && !low)
        return "0"
    if(!value && low)
        return low
    return "0"
}

export const DeviceSwitchField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {
  const [value, setValue] = useState<boolean>(getInitData(field.high, field.value));
  const {sendValue} = useSendValue()

  useEffect(() => {
    setValue(prev=>getData(field.high, field.low, field.value, prev));
  }, [field.value, field.high, field.id]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setValue(newValue);
    sendValue(deviceName, field.id, getOutData(field.high, field.low, newValue))
  },[sendValue, deviceName, field.id, field.high, field.low])


  return (
    <div className="device-field-container">
      <div className="device-field-input-container">
      <label className="device-field-label">{field.name}</label>
        <div className="device-field-input">
            <Switch checked={value} onChange={handleChange}/>
        </div>
      </div>
    </div>
  );
};