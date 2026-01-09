import {DeviceSchema, PatchStateDevice, StateDeviceSchema} from '../models/device'

// Действия для работы с массивом данных устройств
const enum DeviceActionTypes {
    SET_DEVICES_DATA = 'SET_DEVICES_DATA',
    UPDATE_DEVICE_VALUE = 'UPDATE_DEVICE_VALUE',
  }
  
  // Интерфейсы для действий
  interface SetDevicesDataAction {
    type: DeviceActionTypes.SET_DEVICES_DATA;
    payload: DeviceSchema[];
  }

  interface SetDevicesDataAction {
    type: DeviceActionTypes.SET_DEVICES_DATA;
    payload: DeviceSchema[];
  }
  
  interface UpdateDeviceValueAction {
    type: DeviceActionTypes.UPDATE_DEVICE_VALUE;
    payload: PatchStateDevice;
  }
  
  // Все возможные действия
  type DeviceActions = SetDevicesDataAction | UpdateDeviceValueAction;

  interface DeviceState {
    devicesData: StateDeviceSchema[];  // массив устройств
  }
  
  const initialState: DeviceState = {
    devicesData: [],  // пустой массив устройств по умолчанию
  };

  export const deviceReducer = (
    state: DeviceState = initialState,
    action: DeviceActions
  ): DeviceState => {
    switch (action.type) {
      case DeviceActionTypes.SET_DEVICES_DATA:
        return {
          ...state,
          devicesData: action.payload.map(item=>{
            const cond = state.devicesData.find(i=>i.system_name === item.system_name)
            if(!cond){
              return {...item, version: 0}
            }
            else{
              return {...item, version: cond.version}
            }
          }
            
          ),  // сохраняем массив устройств
        };
  
      case DeviceActionTypes.UPDATE_DEVICE_VALUE:{
        // Обновляем устройство с указанным ID и его поле
        const updatedDevices = state.devicesData.map(device =>{
          if(device.system_name === action.payload.system_name)
          {
            const values = device.value ?? {}
            Object.entries(action.payload.changes).forEach(([key, value]) => values[key]=value)
            return {
                ...device,
                fields: device.fields?.map(field =>{
                  const newValue = action.payload.changes[field.name]
                  if(newValue !== null && newValue !== undefined){
                    return {...field, value: newValue}
                  }
                  else{
                    return field
                  }
                }),
                value: values
              }
          }
          else{
            return device
          }
        });
  
        return {
          ...state,
          devicesData: updatedDevices,  // возвращаем обновленный массив устройств
        };
      }

      default:
        return state;
    }
  };
  
  // Действие для установки массива данных устройств
export const setDevicesData = (devices: DeviceSchema[]): SetDevicesDataAction => ({
    type: DeviceActionTypes.SET_DEVICES_DATA,
    payload: devices,
  });
  
  // Действие для обновления значения поля устройства в массиве
  export const updateDeviceValue = (patch: PatchStateDevice): UpdateDeviceValueAction => ({
    type: DeviceActionTypes.UPDATE_DEVICE_VALUE,
    payload: patch,
  });
