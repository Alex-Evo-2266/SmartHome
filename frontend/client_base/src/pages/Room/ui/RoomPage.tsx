import { BaseDialog, FilterGroup, GridLayout, GridLayoutItem, MoreVertical, Panel, SearchAndFilter, SelectedFilters, Trash, Typography } from 'alex-evo-sh-ui-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoomAPI } from '../../../entites/rooms/api/roomsAPI';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Room } from '../../../entites/rooms';
import { DeviceSchema } from '../../../entites/devices';
import { TypeDevice } from '../../../entites/devices/models/type';
import { useAppSelector } from '../../../shared/lib/hooks/redux';
import { DeviceCard } from '../../../widgets/DeviceCard';
import './RoomPage.scss'
import { capitalizeFirst, DialogPortal, IconButtonMenu } from '../../../shared';

function isTypeDevice(value: unknown): value is TypeDevice{
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name_type" in value &&
    "fields" in value &&
    "device" in value &&
    typeof (value as any).name_type === "string"
  );
}

function objectToArray<T>(obj: Record<string, T>): { name: string; options: T }[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    options: value,
  }));
}

// Функция извлечения уникальных значений по ключам
function extractUniqueValues<T extends keyof DeviceSchema>(
  devices: DeviceSchema[],
  keys: T[]
): { [K in T]: (K extends "type_mask" ? string[] : DeviceSchema[K][]) } {
  const result = {} as any;

  keys.forEach((key) => {
    const values = new Set<any>();
    for (const device of devices) {
      const value = device[key];
      if (value !== undefined) {
        if (key === "type_mask" && isTypeDevice(value)) {
          values.add(value.name_type);
        } else if (value != null) {
          values.add(value);
        }
      }
    }
    result[key] = Array.from(values);
  });

  return result;
}

function matchesFilterFromSelected(
  device: DeviceSchema,
  filters: SelectedFilters
): boolean {
  for (const key in filters) {
    const filterValues = filters[key];

    // Пропустить группу, если она пустая (ничего не выбрано)
    if (!filterValues || filterValues.length === 0) {
      continue;
    }

    const value = device[key as keyof DeviceSchema];

    if (value === undefined) return false;

    if (key === "type_mask") {
      const nameType = (value as TypeDevice | undefined)?.name_type;
      if (!nameType || !filterValues.includes(nameType)) {
        return false;
      }
    } else {
      if (!filterValues.includes(String(value))) {
        return false;
      }
    }
  }

  return true;
}

export const RoomPage:React.FC = () => {

    const navigate = useNavigate();
    const { name } = useParams<{name: string}>();
    const {getRoom, deleteRoom} = useRoomAPI()
    const [room, setRoom] = useState<Room | null>(null)
    const {devicesData} = useAppSelector(state=>state.devices)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false)

    const filters = useMemo<FilterGroup[]>(()=>{
        const keys_val = extractUniqueValues(devicesData, ['type_mask', 'class_device', 'status'])
        return objectToArray(keys_val)
    },[devicesData])

    const filteredDevices = useMemo(()=>devicesData
        .filter(device => room?.devices.map(item=>item.system_name).includes(device.system_name))
        .filter(device => device.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(device => matchesFilterFromSelected(device, selectedFilters))
        .sort((a, b) => a.name.localeCompare(b.name)),[devicesData, searchQuery, selectedFilters, room]) 

    const loadRoom = useCallback(async()=>{
        if(!name) return;
        const room = await getRoom(name)
        setRoom(room)
    },[name])

    const deleteRoomHandler = useCallback(async()=>{
      if(!name) return;
      await deleteRoom(name)
      setDeleteVisible(false)
      navigate('/room')
    },[deleteRoom, name])

    useEffect(()=>{
        loadRoom()
    },[loadRoom])

    if(!name){
        navigate('/room')
        return null
    } 

    return(
        <div className="room-page-device-list container-page">
            <Panel borderRadius={24} className='rooms-header-panel'>
                <Typography type='heading'>{capitalizeFirst(name)}</Typography>
                <IconButtonMenu icon={<MoreVertical/>} blocks={[{
                  items:[{
                    title: "delete",
                    icon: <Trash/>,
                    onClick: ()=>setDeleteVisible(true)
                  }]
                }]}/>
            </Panel>
            <SearchAndFilter filters={filters} onSearch={setSearchQuery} onChangeFilter={setSelectedFilters} selectedFilters={selectedFilters}/>
            <GridLayout className="device-container" itemMaxWith="300px" itemMinWith="200px">
            {
                filteredDevices.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            { 
              deleteVisible&&
              <DialogPortal>
                <BaseDialog header='delete room' text='delete room' onHide={()=>setDeleteVisible(false)} onSuccess={deleteRoomHandler}/>
              </DialogPortal>
            }
            
        </div>
    )
}