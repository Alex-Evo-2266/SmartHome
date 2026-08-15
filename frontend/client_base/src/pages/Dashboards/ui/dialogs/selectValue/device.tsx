import { WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { TypeDeviceField } from "@src/entites/devices"
import { SelectField } from "@src/shared"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { ContentBox, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo, useState } from "react"

function parseBinding(template:unknown) {
  // Результат по умолчанию
  const result = {
    selectDevice: null,
    selectDeviceField: null,
  };

  // Проверяем, что это объект с полем binding
  if (!template || typeof template !== 'object' || !("binding" in template)) {
    return result;
  }

  const bindingStr = template.binding;
  
  // Проверяем, что это строка
  if (typeof bindingStr !== 'string') {
    return result;
  }

  // Регулярное выражение для парсинга
  // Ищем шаблон: rooms.${...}.${...}.${...}
  const regex = /^devices\.([^}]+)\.([^}]+)$/;
  const match = bindingStr.match(regex);

  if (!match) {
    return result;
  }

  // Извлекаем значения
  const [, selectDevice, selectDeviceField] = match;

  // Проверяем, что все переменные не пустые
  if (selectDevice && selectDeviceField) {
    return {
      selectDevice: selectDevice.trim(),
      selectDeviceField: selectDeviceField.trim()
    };
  }

  return result;
}

export interface DeviceSelectProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettings
    types: TypeDeviceField[]
    readonly: boolean
}

export const DeviceSelectField = (props: DeviceSelectProps) => {

    const initValue = parseBinding(props.value)

    const { devicesData } = useAppSelector((state) => state.devices);
    const devicesDataText = useMemo(()=>
        devicesData.filter(item=>
            (item.fields?.some(item2=>
                props.types.includes(item2.type)
            ) ?? false)
        ),
        [devicesData, props.types]
    )
    const [selectDevice, setSelectDevice] = useState<string | null>(initValue.selectDevice)
    const filterFields = useMemo(()=>{
        const curDevice = devicesData.find(item=>item.system_name === selectDevice)
        return curDevice?.fields?.filter(item=>
            props.types.includes(item.type) && 
            (props.readonly || (!props.readonly && !item.read_only))
        ) ?? []
    },[devicesData, selectDevice, props.types, props.readonly])
    const [selectField, setSelectField] = useState<string | null>(initValue.selectDeviceField)

    const deviceHandler = useCallback((value:string)=>{
        setSelectDevice(value)
        setSelectField(null)
    },[])
    const deviceFieldHandler = useCallback((value:string)=>{
        setSelectField(value)
        props.onChange({binding:`devices.${selectDevice}.${value}`}, props.settings.data_name)
    },[props.onChange, selectDevice, props.settings.data_name])


    return(
        <ContentBox label={props.settings.lable}>
            <Typography type="small">select device field</Typography>
            <SelectField 
                border 
                placeholder="devices"
                items={devicesDataText.map(item=>({title:item.name, value:item.system_name}))}
                onChange={deviceHandler}
                value={selectDevice ?? ""}
            />
            {
                selectDevice &&
                <SelectField 
                    border 
                    placeholder="field"
                    items={filterFields.map(item=>({title:item.name, value:item.id}))}
                    onChange={deviceFieldHandler}
                    value={selectField ?? ""}
                />
            }
        </ContentBox>
    )
}