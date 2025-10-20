import {DeviceSchema} from '../models/device'

// Действия для работы с массивом данных устройств
enum DeviceActionTypes {
    SET_DEVICES_DATA = 'SET_DEVICES_DATA',
    UPDATE_DEVICE_VALUE = 'UPDATE_DEVICE_VALUE',
  }
  
  // Интерфейсы для действий
  interface SetDevicesDataAction {
    type: DeviceActionTypes.SET_DEVICES_DATA;
    payload: DeviceSchema[];
  }
  
  interface UpdateDeviceValueAction {
    type: DeviceActionTypes.UPDATE_DEVICE_VALUE;
    payload: {
      deviceId: string;
      fieldName: string;
      value: string;
    };
  }
  
  // Все возможные действия
  type DeviceActions = SetDevicesDataAction | UpdateDeviceValueAction;

  interface DeviceState {
    devicesData: DeviceSchema[];  // массив устройств
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
          devicesData: action.payload,  // сохраняем массив устройств
        };
  
      case DeviceActionTypes.UPDATE_DEVICE_VALUE:
        // Обновляем устройство с указанным ID и его поле
        const updatedDevices = state.devicesData.map(device =>
          device.name === action.payload.deviceId
            ? {
                ...device,
                fields: device.fields?.map(field =>
                  field.name === action.payload.fieldName
                    ? { ...field, value: action.payload.value }  // обновляем значение поля
                    : field
                ),
              }
            : device
        );
  
        return {
          ...state,
          devicesData: updatedDevices,  // возвращаем обновленный массив устройств
        };
  
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
  export const updateDeviceValue = (deviceId: string, fieldName: string, value: string): UpdateDeviceValueAction => ({
    type: DeviceActionTypes.UPDATE_DEVICE_VALUE,
    payload: { deviceId, fieldName, value },
  });
