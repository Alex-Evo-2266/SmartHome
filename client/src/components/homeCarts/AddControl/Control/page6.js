import React, {useState} from 'react'

export const Page6 = ({field ,next, back, hide})=>{
  const [text, setText] = useState('')

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">Add element</div>
      <div className="dividers"></div>
      <div className="dialogBody">
        <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
          <input name="name" onChange={(v)=>setText(v.target.value)} required type="text" value={text||""}></input>
          <label>title</label>
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
