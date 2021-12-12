import React,{useContext,useState} from 'react'
import {CartEditContext} from '../CartEditContext'

export const ElementEdit = ({type}) =>{
  const {cartEdit, hide} = useContext(CartEditContext)
  const [butonConf ,setButonConf] = useState({
    order:String(cartEdit.cart.order),
    width:cartEdit.cart.width,
    height:cartEdit.cart.height
  })

  const outHandler = ()=>{
    if(typeof(cartEdit.OK)!=="function")
      return;
    cartEdit.OK(cartEdit.cart.index,butonConf)
    hide()
  }

  return(
    <>
      <div className="backGlass" onClick={hide}></div>
      <div className="dialogCoteiner">
        <div className="dialogHeader">Edit card</div>
        <div className="dividers"></div>
        <div className="dialogBody">
          <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
            <input name="order" min={0} max={500} onChange={(v)=>setButonConf({...butonConf,order:v.target.value})} required type="number" value={butonConf.order||0}></input>
            <label>order</label>
          </div>
          <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
            <input name="width" min={1} max={4} onChange={(v)=>setButonConf({...butonConf,width:v.target.value})} required type="number" value={butonConf.width||1}></input>
            <label>width</label>
          </div>
          <div className="input-data" style={{marginTop:"15px",marginBottom:"10px"}}>
            <input name="height" min={1} max={4} onChange={(v)=>setButonConf({...butonConf,height:v.target.value})} required type="number" value={butonConf.height||1}></input>
            <label>height</label>
          </div>
        </div>
        <div className="dividers"></div>
        <div className="dialogFooter">
          <button className="dialogButton button highSelection" onClick={outHandler}>save</button>
        </div>
      </div>
    </>
  )

  // return(
  //   <BackForm onClick={hide}>
  //   <ModalWindow hide={hide} title="Edit Cart" moving={false} backForm={true} heightToolbar={30} styleContent={{height:"calc(100% - 30px"}} style={{width:"400px",height:"calc(100% - 200px)",left:"50%",transform: "translateX(-50%)", top:"100px",}}>
  //     <div className="editcart-conteiner">
  //       <div className="editcart-element">
  //         <p>button priority</p>
  //         <InputNumber Xten={false} Value={cartEdit.cart.order} result={(v)=>setButonConf({...butonConf,order:v})} min={0} max={500}/>
  //       </div>
  //       {
  //         (type!=="button-line")?
  //         <>
  //         <div className="editcart-element">
  //           <p>width</p>
  //           <InputNumber Xten={false} Value={cartEdit.cart.width} result={(v)=>setButonConf({...butonConf,width:v})} min={1} max={4}/>
  //         </div>
  //         <div className="editcart-element">
  //           <p>height</p>
  //           <InputNumber Xten={false} Value={cartEdit.cart.height} result={(v)=>setButonConf({...butonConf,height:v})} min={1} max={4}/>
  //         </div>
  //         </>
  //         :null
  //       }
  //       <button onClick = {outHandler}>Ок</button>
  //     </div>
  //   </ModalWindow>
  //   </BackForm>
  // )
}
