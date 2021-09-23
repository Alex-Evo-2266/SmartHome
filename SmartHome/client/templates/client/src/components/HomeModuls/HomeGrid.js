import React,{useState,useEffect,useContext,useCallback,useRef} from 'react'
import {BaseElement} from '../../components/homeCarts/cards/BaseCard'
import {getEmptyMap, addEmptyEl} from './utils'
import {draganddrop} from './draganddrop'

const SIZE_ELEMENT = 80
const GAP = 0
const WIDTH_SEGMENT = 4
const HEIGHT_SEGMENT = 2

export const HomeGrid = ({cards, conteiner, setCards}) => {
  const [currentCard, setCurrentCard] = useState(null)
  const root = useRef(null)

  const getArrayElementBySegment = (items, indexSegment)=>{
    let elements = []
    const countElementInSegment = WIDTH_SEGMENT * HEIGHT_SEGMENT
    let map = getEmptyMap(WIDTH_SEGMENT, HEIGHT_SEGMENT)
    for (var item of items) {
      let seg = Math.ceil(item.poz / countElementInSegment) - 1
      let pozition = (item.poz % countElementInSegment)?item.poz % countElementInSegment:countElementInSegment
      if(seg === indexSegment)
      {
        const cords = getCordsEl(pozition, item.width, item.height)
        elements.push({...item, cords})
        for (var i = cords.y; i < cords.endY; i++) {
          for (var j = cords.x; j < cords.endX; j++) {
            map[i][j] = item.id
          }
        }
      }
    }
    elements = addEmptyEl(map,elements,indexSegment,countElementInSegment)
    return elements
  }

  useEffect(()=>{
    let control = null
    if(root.current)
      control = draganddrop(root.current)
    return () =>{
      console.log("f");
      control?.delete()
    }
  })

  if(!conteiner.current)
    return null

  return(
    <div className="homeSegmentContainer" ref={root}>
    {
      generateSegments(conteiner.current).map((_,index)=>{
        return(
          <div className="homeSegment" key={index} style={{
            gridTemplateColumns: `repeat(${WIDTH_SEGMENT} , ${SIZE_ELEMENT}px)`,
            gridTemplateRows: `repeat(${HEIGHT_SEGMENT} , ${SIZE_ELEMENT}px)`,
            gridGap: `${GAP}px`,
            padding: `${GAP / 2}px`
          }}>
          {
            getArrayElementBySegment(cards, index).map((item, index2)=>{
              let x = item.cords.x + 1
              let y = item.cords.y + 1
              let endX = item.cords.endX + 1
              let endY = item.cords.endY + 1
              return(
                <div
                className="countElementInSegment"
                key={index2}
                data-el="drag"
                style={{
                  gridColumnStart:x,
                  gridColumnEnd:endX,
                  gridRowStart:y,
                  gridRowEnd:endY,
                }}
                >
                {
                  (item.type !== "empty")?
                  <BaseElement
                  dataType="move"
                  >
                    ft{item.id}
                  </BaseElement>:
                  <div className="empty" data-type="empty"></div>
                }
                </div>
              )
            })
          }
          </div>
        )
      })
    }
    </div>
  )
}


function generateSegments(root){
  const widthSeg = Math.floor(root.clientWidth / ((SIZE_ELEMENT + GAP) * WIDTH_SEGMENT))
  const heightSeg = Math.floor(root.clientHeight / ((SIZE_ELEMENT + GAP) * HEIGHT_SEGMENT))
  return new Array(widthSeg * heightSeg).fill(0)
}

function getCordsEl(poz, width, height){
  return {
    x: ((poz % WIDTH_SEGMENT)?(poz % WIDTH_SEGMENT):WIDTH_SEGMENT) - 1,
    y: Math.ceil(poz / WIDTH_SEGMENT) - 1,
    endX: ((poz % WIDTH_SEGMENT)?(poz % WIDTH_SEGMENT):WIDTH_SEGMENT) - 1 + width,
    endY: Math.ceil(poz / WIDTH_SEGMENT) - 1 + height
  }
}
