import { DeviceData } from "../.."

enum DeviceActionType{
    SET_DEVICE_DATA = "SET_DEVICE_DATA"
}

interface IDeviceState{
    devices: DeviceData[]
}

interface DeviceSetDataAction{
    type: DeviceActionType.SET_DEVICE_DATA
    payload: DeviceData[]
}

type DeviceAction = DeviceSetDataAction

const initState: IDeviceState = {
    devices: []
}

export const deviceReducer = (state:IDeviceState = initState, action:DeviceAction) => {
    switch (action.type){
        case DeviceActionType.SET_DEVICE_DATA:
            return {...state, devices: action.payload}
        default:
            return state
    }
}

export const setDevices = (payload:DeviceData[]):DeviceAction => ({type: DeviceActionType.SET_DEVICE_DATA, payload})