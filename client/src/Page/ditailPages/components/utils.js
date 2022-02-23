
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

export const converHistorys = (data, fieldname)=>{
  let newData = {data:[]}
  newData.name = fieldname
  for (var item of data) {
    if(item.field === fieldname)
    {
      newData.type = item.type
      newData.utils = item.utils
      newData.deviceName = item.deviceName
      if(item.type === "binary" || item.type === "number")
        newData.data.push({y:Number(item.value),x:new Date(Number(item.datatime) * 1000)})
      else if(newData.data.length === 0 || newData.data[newData.data.length - 1].y !== item.value)
        newData.data.push({y:item.value,x:new Date(Number(item.datatime) * 1000)})
    }
  }
  return newData
}

const typeFieldToTypeChart = {
  number:"area",
  binary:"stepArea"
}

export function dateFormat(date) {
  const shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${date.getFullYear()}-${shortMonths[date.getMonth()]}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const textColor = (fon)=>{
  let color = "gray"
  if (fon[0] === "#") {
      fon = fon.slice(1);
  }
  var num = parseInt(fon,16);
  var r = (num >> 16);
  var b = ((num >> 8) & 0x00FF);
  var g = (num & 0x0000FF);
  if ((r < 200||g < 200||b < 200))
  {
    color="#fff";
  }
  return color;
}

export function getOption(data, style=null) {
  let baseConf = {
			theme: "light2",
			animationEnabled: true,
			// exportEnabled: true,
			title:{
				text: `${data.deviceName}-${data.name}`,
			},
			axisY:{
				title: data.utils||"Value",
			},
      axisX:{
        valueFormatString: "DD-MM-YY HH:mm:ss",
        margin:5,
      },
			data: [{
				type: typeFieldToTypeChart[data.type],
				xValueFormatString: "DDD HH:mm:ss",
				markerSize: 5,
				dataPoints: data.data
			}]
		}
  if(data.type==="binary"){
    baseConf.axisY.interval = 1
    baseConf.axisY.minimum = -0.02
    baseConf.axisY.maximum = 1.02
  }
  if(style?.c2)
  {
    baseConf.backgroundColor = style?.c2
    baseConf.axisY.labelFontColor = textColor(style?.c2)
    baseConf.title.fontColor = textColor(style?.c2)
    baseConf.axisX.labelFontColor = textColor(style?.c2)
  }
  return baseConf
}
