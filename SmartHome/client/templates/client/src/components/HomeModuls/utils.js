export const getEmptyMap = (coll, row)=>{
  let map = []
  for (var i = 0; i < row; i++) {
    map.push(new Array(coll).fill(0))
  }
  return map
}

export const addEmptyEl = (map, elements, indexSegment,countElementInSegment)=>{
  let poz = indexSegment * countElementInSegment;
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      poz++;
      if(map[i][j] === 0)
        elements.push({
          type:"empty",
          poz,
          cords:{
            x:j,
            y:i,
            endX:j+1,
            endY:i+1
          }
        })
    }
  }
  return elements
}
