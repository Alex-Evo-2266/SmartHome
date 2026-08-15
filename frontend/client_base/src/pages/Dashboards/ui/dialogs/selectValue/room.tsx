import { WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { TypeDeviceField } from "@src/entites/devices"
import { Room } from "@src/entites/rooms"
import { useRoom } from "@src/features/Room"
import { SelectField } from "@src/shared"
import { ContentBox, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useMemo, useState } from "react"

export interface RoomSelectProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettings
    types: TypeDeviceField[]
    readonly: boolean
}

function parseBinding(template:unknown) {
  // Результат по умолчанию
  const result = {
    selectRoom: null,
    selectRoomDevice: null,
    selectRoomDeviceField: null
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
  const regex = /^rooms\.([^}]+)\.([^}]+)\.([^}]+)$/;
  const match = bindingStr.match(regex);

  if (!match) {
    return result;
  }

  // Извлекаем значения
  const [, selectRoom, selectRoomDevice, selectRoomDeviceField] = match;

  // Проверяем, что все переменные не пустые
  if (selectRoom && selectRoomDevice && selectRoomDeviceField) {
    return {
      selectRoom: selectRoom.trim(),
      selectRoomDevice: selectRoomDevice.trim(),
      selectRoomDeviceField: selectRoomDeviceField.trim()
    };
  }

  return result;
}


function filterFields(rooms:Room[], room_name: string, device_name: string, types:TypeDeviceField[], readonly: boolean):string[]{
    const curRoom = rooms.find(item=>item.name_room === room_name)
    const condDevice = curRoom?.device_room[device_name]
    if(condDevice === undefined) return []
    const filtredFields: string[] = []
    for(let key in condDevice.fields){
        if(
            types.includes(condDevice.fields[key].field_type) && 
            ((!readonly && !condDevice.fields[key].readonly) || readonly) 
        ){
            filtredFields.push(key)
        }
    }
    return filtredFields
}

function checkFields(room:Room, device_name: string, types:TypeDeviceField[], readonly: boolean):boolean{
    const condDevice = room.device_room[device_name]
    if(condDevice === undefined) return false
    return Object.values(condDevice.fields).some(item=>
            types.includes(item.field_type) && 
            ((!readonly && !item.readonly) || readonly) 
        )
}

export const RoomObjectSelectField = (props: RoomSelectProps) => {

    const {rooms} = useRoom()
    const baseValue = parseBinding(props.value)
    console.log(baseValue, props.value)
    const [selectRoom, setSelectRoom] = useState<string | null>(baseValue.selectRoom)
    const [selectRoomDevice, setSelectRoomDevice] = useState<string | null>(baseValue.selectRoomDevice)
    const [selectRoomDeviceField, setSelectRoomDeviceField] = useState<string | null>(baseValue.selectRoomDeviceField)

    const filterDevice = useMemo(()=>{
        const curRoom = rooms.find(item=>item.name_room === selectRoom)
        if(curRoom === undefined) return[]
        const filtredDevices: string[] = []
        for(let key in curRoom.device_room){
            if(checkFields(curRoom, key, props.types, props.readonly))
            filtredDevices.push(key)
        }
        return filtredDevices.map(item=>({title:item, value:item}))
    },[selectRoom, rooms, props.types, props.readonly])

    const filterField = useMemo(()=>{
        if(!selectRoom || !selectRoomDevice) return[]
        const filtredFields: string[] = filterFields(rooms, selectRoom, selectRoomDevice, props.types, props.readonly)
        return filtredFields.map(item=>({title:item, value:item}))
    },[selectRoom, rooms, selectRoomDevice, props.types, props.readonly])

    const roomHandler = useCallback((value:string)=>{
        setSelectRoom(value)
        setSelectRoomDevice(null)
        setSelectRoomDeviceField(null)
    },[])
    const deviceRoomHandler = useCallback((value:string)=>{
        setSelectRoomDevice(value)
        setSelectRoomDeviceField(null)
    },[])
    const deviceRoomFieldHandler = useCallback((value:string)=>{
        setSelectRoomDeviceField(value)
        props.onChange({binding:`rooms.${selectRoom}.${selectRoomDevice}.${value}`}, props.settings.data_name)
    },[props.onChange, selectRoom, selectRoomDevice, props.settings.data_name])
    

    return(
        <ContentBox label={props.settings.lable}>
            <Typography type="small">select device field</Typography>
            <SelectField 
                border 
                placeholder="room"
                items={rooms.map(item=>({title:item.name_room, value:item.name_room}))}
                onChange={roomHandler}
                value={selectRoom ?? ""}
            />
            {
                selectRoom && 
                <SelectField 
                    border
                    placeholder="device"
                    items={filterDevice}
                    onChange={deviceRoomHandler}
                    value={selectRoomDevice ?? ""}
                />
            }
            {
                selectRoomDevice && 
                <SelectField 
                    border 
                    placeholder="field"
                    items={filterField}
                    onChange={deviceRoomFieldHandler}
                    value={selectRoomDeviceField ?? ""}
                />
            }
        </ContentBox>
    )
}