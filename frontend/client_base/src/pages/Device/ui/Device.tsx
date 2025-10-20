import { FAB, FilterGroup, GridLayout, GridLayoutItem, Plus, Search, SearchAndFilter, SelectedFilters } from "alex-evo-sh-ui-kit"
import { DialogPortal } from "../../../shared"
import { AddDeviceDialog } from "../../../widgets/AddDevice"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import "./DevicePage.scss"
import { useToggle } from "../hooks/addDevice.hook"
import { useMemo, useState } from "react"
import { DeviceSchema } from "../../../entites/devices"
import { TypeDevice } from "../../../entites/devices/models/type"

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



export const DevicePage = () => {
    const {visible:addDeviceDialogVisible, show:showAddDeviceDialog, hide:hideAddDeviceDialog} = useToggle()
    const {devicesData} = useAppSelector(state=>state.devices)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})

    // Фильтрация и сортировка устройств по имени
    const filteredDevices = useMemo(()=>devicesData
    .filter(device => device.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(device => matchesFilterFromSelected(device, selectedFilters))
    .sort((a, b) => a.name.localeCompare(b.name)),[devicesData, searchQuery, selectedFilters]) 

    const filters = useMemo<FilterGroup[]>(()=>{
        const keys_val = extractUniqueValues(devicesData, ['type_mask', 'class_device', 'status'])
        return objectToArray(keys_val)
    },[devicesData])

    return(
        <div className="device-page container-page">
            <SearchAndFilter 
                filters={filters} 
                onChangeFilter={setSelectedFilters} 
                selectedFilters={selectedFilters} 
                onSearch={data => setSearchQuery(data)}
            />
            <GridLayout className="device-container" itemMaxWith="300px" itemMinWith="200px">
            {
                filteredDevices.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB className="base-fab" onClick={showAddDeviceDialog} icon={<Plus/>}/>
            {
                addDeviceDialogVisible &&
                <DialogPortal>
                    <AddDeviceDialog onHide={hideAddDeviceDialog}/>
                </DialogPortal>
            }
        </div>
    )
}
