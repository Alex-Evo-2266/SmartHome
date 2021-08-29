

function lineDatatoNumber(data) {
  let n = []
  for (var item of data) {
    let g = []
    for (var i = 0; i < item.length; i++) {
      if(i===0)g.push(item[i])
      else if(item[i]===null)g.push(0)
      else g.push(Number(item[i]))
    }
    n.push(g)
  }
  return n
}

const colorLine = [
  '#f00',
  '#0f0',
  '#20B2AA',
  '#FFA500',
  '#DA70D6',
  '#0000FF'
]

export const generateDatabyDevice=(data,device)=>{
  let newData = {
    columns:[],
    types:{},
    names:{},
    colors:{}
  }
  let count = 0

  newData.columns.push(['x'].concat(data.time_line))
  newData.types.x="x"

  let dev = data.lines[device]
  if(!dev) return null
  for (var key in dev) {
    let line = dev[key]
    if(!line) continue
    const linemet = `y${count++}`
    newData.columns.push([linemet].concat(line))
    newData.types[linemet]="line"
    newData.names[linemet] = key
    newData.colors[linemet] = colorLine[((count-1)>=colorLine.length)?(count-1)-colorLine.length:(count-1)]||'#f00'
  }
  newData.columns = lineDatatoNumber(newData.columns)
  return newData
}

function castomZip(arr1, arr2) {
  const min = (arr1.length<arr2.length)?arr1.length:arr2.length
  let arrdict = []
  for (var i = 0; i < min; i++) {
    arrdict[i] = { x: new Date(arr1[i]), y: arr2[i] }
  }
  return arrdict
}

export function toDate(timestamp) {
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
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${shortMonths[date.getMonth()]}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const typeFieldToTypeChart = {
  number:"area",
  binary:"stepArea"
}

export function getOption(data) {
  let baseConf = {
			theme: "light2",
			animationEnabled: true,
			// exportEnabled: true,
      backgroundColor: "#333",
			title:{
				text: `${data.deviceName}-${data.name}`,
			},
			axisY:{
				title: data.valueName||"Value",
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
  return baseConf
}
