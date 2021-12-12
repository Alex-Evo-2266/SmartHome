import React,{useContext} from 'react'
import {EditModeContext} from '../../context/EditMode'
import {Header} from '../header'

export const EditToolbar = ({show=false,save=null}) => {
  const {setMode,add} = useContext(EditModeContext)

  if(show){
    return(
      <Header name="Home">
        <button className="btn" onClick={()=>add()}>
          <i className="far fa-window-restore"></i>
        </button>
        <button className="btn" onClick={()=>add("line")}>
          <i className="far fa-list-alt"></i>
        </button>
        <button className="btn spec" onClick={()=>{
          if(typeof(save)==="function")
            save()
          setMode(false)
        }}>
          <i className="fas fa-check"></i>
        </button>
      </Header>
    )
  }

  return(
    <Header name="Home">
      <button className="btn" onClick={()=>setMode(prev=>!prev)}>
        <i className="fas fa-cog"></i>
      </button>
    </Header>
  )

  // return(
  //   <div className={`conteiner toolbar ${(show)?"active":""}`}>
  //     <ul className="elementConteiner top">
  //       <li>
  //         <BtnElement switchMode={false} onClick={()=>{
  //           add()
  //         }}>
  //           <i className="far fa-window-restore"></i>
  //         </BtnElement>
  //       </li>
  //       <li>
  //         <BtnElement switchMode={false} onClick={()=>{
  //           add("line")
  //         }}>
  //           <i className="far fa-light"></i>
  //         </BtnElement>
  //       </li>
  //       <li>
  //         <BtnElement switchMode={false} onClick={()=>{
  //           if(typeof(save)==="function")
  //             save()
  //           setMode(false)
  //         }}>
  //           <i className="fas fa-check"></i>
  //         </BtnElement>
  //       </li>
  //     </ul>
  //   </div>
  // )
}
