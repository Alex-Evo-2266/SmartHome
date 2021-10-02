import React, {useState} from 'react'

export const Page4 = ({field ,next, back, hide})=>{
  const [number, setNumber] = useState(0)
  const [text, setText] = useState('')

  const values = ()=>{
    let arr = field.values.split(',')
    arr = arr.map(item=>item.trim())
    return arr
  }

  if(field.type === "number")
  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">Add element</div>
      <div className="dividers"></div>
      <div className="dialogBody">
        <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
          <input name="name" min={Number(field.low)} max={Number(field.high)} onChange={(v)=>setNumber(v.target.value)} required type="number" value={number||0}></input>
          <label>state</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="dialogFooter">
        <button className="dialogButton button normalSelection" onClick={back}>BACK</button>
        <button className="dialogButton button normalSelection" onClick={()=>next(number)} disabled={number===null}>NEXT</button>
      </div>
    </div>
    </>
  )

  if(field.type === "text")
  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">Add element</div>
      <div className="dividers"></div>
      <div className="dialogBody">
        <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
          <input name="name" onChange={(v)=>setText(v.target.value)} required type="text" value={text||""}></input>
          <label>state</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="dialogFooter">
        <button className="dialogButton button normalSelection" onClick={back}>BACK</button>
        <button className="dialogButton button normalSelection" onClick={()=>next(text)} disabled={text===""}>NEXT</button>
      </div>
    </div>
    </>
  )

  if(field.type === "enum")
  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">Add element</div>
      <div className="dividers"></div>
      <div className="dialogBody">
        <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
          <select onChange={(v)=>setText(v.target.value)} required value={text||values()[0]}>
          {
            values().map((item, index)=>(
              <option key={index} value={item}>{item}</option>
            ))
          }
          </select>
          <label>state</label>
        </div>
      </div>
      <div className="dividers"></div>
      <div className="dialogFooter">
        <button className="dialogButton button normalSelection" onClick={back}>BACK</button>
        <button className="dialogButton button normalSelection" onClick={()=>next(text)} disabled={text===""}>NEXT</button>
      </div>
    </div>
    </>
  )
}
