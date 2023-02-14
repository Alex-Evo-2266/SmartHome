export const formatObjects = (objects) => objects.map(item=>({title:item, data:item}))
export const formatDevice = (devices) => devices.map(item=>({title:item.name, data:item}))
export const formatField = (fields) => fields.map(item=>({title:item.name, data:item}))

export const filterFieldByType = (fields, type) => fields.filter(item=>item.type === type)
export const filterDeviceByTypeField = (devices, type) => devices.filter(item=>{
    let condidatField = filterFieldByType(item.fields, type)
    return (condidatField.length !== 0)
})

export const searchField = (devices, systemName, fieldName) => {
    let devCondidat = devices.filter(item=>item.system_name === systemName)
    if (devCondidat.length == 0) return null
    let fieldCondidat = devCondidat[0].fields.filter(item=>item.name === fieldName)
    if (fieldCondidat.length == 0) return null
    return fieldCondidat[0]
}

export const getTypeField = (devices, systemName, fieldName, type) => {
    if ((!systemName || !fieldName) && !type)
    {
        throw new Error("invalid value argument")
    }
    if (type)
        return (type)
    let field = searchField(devices, systemName, fieldName)
    if (!field) return null
    return (field.type)
}

export const getValues = (devices, systemName, fieldName) => {
    let field = searchField(devices, systemName, fieldName)
    if (!field) return null
    if (field.type === "binary")
        return ["off", "on"]
    if (field.type === "enum")
    {
        let arr = field.enum_values.split(",")
        for (let item of arr)
        {
            item.trim()
        }
        return (arr)
    }
    return []
}

export const getTypeValue = (typeField) => {
    switch (typeField) {
        case "binary":
            return ["select", "device"]
        case "number":
            return ["number", "math", "round", "device"]
        case "text":
            return ["text"]
        case "enum":
            return ["select"]
        default:
            return ["text"]
    }
}

export const defValueData = {
    type:"",
    arg1:"",
    arg2:"",
    operator:"=="
}