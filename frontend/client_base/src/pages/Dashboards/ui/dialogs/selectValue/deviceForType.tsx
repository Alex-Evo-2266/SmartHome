import { WidgetStoreItemSettingsDeviceType } from "@src/entites/dashboard/types/typeData"
import { SelectField } from "@src/shared"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { ContentBox, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo, useState } from "react"

function parseBinding(template:unknown) {
  // Результат по умолчанию
  const result = {
    selectDevice: null
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
  const regex = /^devices\.([^}]+)$/;
  const match = bindingStr.match(regex);

  if (!match) {
    return result;
  }

  // Извлекаем значения
  const [, selectDevice] = match;

  // Проверяем, что все переменные не пустые
  if (selectDevice) {
    return {
      selectDevice: selectDevice.trim()
    };
  }

  return result;
}

export interface DeviceSelectProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettingsDeviceType
    readonly: boolean
}

export const DeviceSelectForType = (props: DeviceSelectProps) => {

    const initValue = parseBinding(props.value)

    const { devicesData } = useAppSelector((state) => state.devices);
    const devicesDataText = useMemo(()=>
        props.settings.device_type?
        devicesData.filter(item=>
            item.all_types.some(item2=>
                item2.name_type.toLocaleLowerCase() === props.settings.device_type?.toLocaleLowerCase()
            )
        ):
        devicesData,
        [devicesData]
    )
    const [selectDevice, setSelectDevice] = useState<string | null>(initValue.selectDevice)

    const deviceHandler = useCallback((value:string)=>{
        setSelectDevice(value)
        props.onChange({binding:`devices.${value}`}, props.settings.data_name)
    },[])

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
        </ContentBox>
    )
}