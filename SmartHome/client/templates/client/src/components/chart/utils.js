
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
  return `${shortMonths[date.getMonth()]} ${date.getDate()}`
}

export function isOver(mouse,x,length,dWidth) {
  if(!mouse) return false
  const width = dWidth / length
  return Math.abs(x - mouse.x)<width/2
}

export function line(ctx,coords,{color="#ff0000"}) {
  ctx.beginPath()
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  for (const [x,y] of coords) {
    ctx.lineTo(x,y)
  }
  ctx.stroke()
  ctx.closePath()
}

export function circle(ctx,[x,y],color) {
  const CIRCLE_RADIUS = 8
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.fillStyle = "#fff"
  ctx.arc(x,y,CIRCLE_RADIUS,0,Math.PI*2)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}

export function boundaries({columns,types}) {
  let min
  let max

  columns.forEach((col) => {
    if(types[col[0]] !=='line') return

    if(typeof min !== 'number') min = col[1]
    if(typeof max !== 'number') max = col[1]

    if(min>col[1])min = col[1]
    if(max<col[1])max = col[1]

    for (let i = 2; i < col.length; i++) {
      if(min>col[i])min = col[i]
      if(max<col[i])max = col[i]
    }
  })
  return [min,max]
}

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
