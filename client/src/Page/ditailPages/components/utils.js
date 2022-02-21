
const getConfig = (device, key)=>{
  if(!device) return null;
  for (var item of device.config) {
    if(item.name === key){
      return item
    }
  }
}

export const getValue = (device, key)=>{
  if(!device) return null;
  let config = getConfig(device, key)
  let val = device?.value[key]
  if(config.type === "binary"){
    if(val === "1")
      return true
    else
      return false
  }
  else
    return val
}
