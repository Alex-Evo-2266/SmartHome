

export interface DeviceOptionAdded{
    fields: boolean
    address: boolean
    token: boolean
}

export interface DeviceOptionChangeField{
    added: boolean
    deleted: boolean
    name: boolean
    address: boolean
    control: boolean
    high: boolean
    low: boolean
    icon: boolean
    type: boolean
    unit: boolean
    enum_values: boolean
    value: boolean
}

export interface DeviceOptionChange{
    fields: DeviceOptionChangeField
    address: boolean
    token: boolean
}

export interface DeviceOption{
    class_name: string
    added: DeviceOptionAdded
    added_url?: string
    change_url?: string
    class_img_url?: string
    change:DeviceOptionChange
    types: string[]
}


// export interface deviceAddedOption{
//     fields: boolean
//     address: boolean
//     token: boolean
// }

// interface deviceChangedFieldOptionResponse{
//     added: boolean
//     deleted: boolean
//     name: boolean
//     address: boolean
//     control: boolean
//     high: boolean
//     low: boolean
//     icon: boolean
//     type: boolean
//     unit: boolean
//     enum_values: boolean
//     value: boolean
// }

// interface deviceChangedOptionResponse{
//     fields: deviceChangedFieldOptionResponse
//     address: boolean
//     token: boolean
// }

// export interface IDeviceOptionResponse{
//     class_name: string
//     added: deviceAddedOption
//     added_url?: string
//     change_url?: string
//     change: deviceChangedOptionResponse
//     types: string[]
// }

// export interface deviceChangedFieldOption{
//     added: boolean
//     deleted: boolean
//     name: boolean
//     address: boolean
//     control: boolean
//     high: boolean
//     low: boolean
//     icon: boolean
//     type: boolean
//     unit: boolean
//     enumValues: boolean
//     value: boolean
// }

// export interface deviceChangedOption{
//     fields: deviceChangedFieldOption
//     address: boolean
//     token: boolean
// }

// export interface IDeviceOption{
//     className: string
//     added: deviceAddedOption
//     addedUrl?: string
//     changeUrl?: string
//     change: deviceChangedOption
//     types: string[]
// }