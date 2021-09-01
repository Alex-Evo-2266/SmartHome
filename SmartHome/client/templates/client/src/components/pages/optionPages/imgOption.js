import React,{useState,useCallback,useEffect,useContext} from 'react'
import {UserContext} from '../../../context/UserContext'
import {Link} from 'react-router-dom'
// import {ImageInput} from '../../moduls/imageInput'

export const ImgOption = () =>{
  const config = useContext(UserContext)

  const [userconf , setUserconf] = useState({
    base:'',
    sunrise:'',
    day:'',
    twilight:'',
    night:''
  });

  const updataConf = useCallback(async()=>{
    if(!config||!config.images)return;
    let fon = {}
    for (var item of config.images) {
      fon = {...fon,[item.type]:item.image}
    }
    setUserconf(prev=>{return{...prev,...fon}})
  },[config])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  return(
    <div className = "pagecontent">
      <div className="configElement block">
        <h2>Background</h2>
      </div>
      <Link to="/gallery" className="btn">Галерея</Link>
      <div className="configElement img">
        <div className="card">
          <div className="imgBx">
            <img src={userconf.base} alt="base"/>
          </div>
          <div className="content">
            <div>
              <h3>Base</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="imgBx">
            <img src={userconf.sunrise} alt="sunrise"/>
          </div>
          <div className="content">
            <div>
              <h3>Sunrise</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="imgBx">
            <img src={userconf.day} alt="day"/>
          </div>
          <div className="content">
            <div>
              <h3>Day</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="imgBx">
            <img src={userconf.twilight} alt="twilight"/>
          </div>
          <div className="content">
            <div>
              <h3>Twilight</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="imgBx">
            <img src={userconf.night} alt="night"/>
          </div>
          <div className="content">
            <div>
              <h3>Night</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

//   return(
//     <div className="configElement img">
//       <h3>Background</h3>
//       <ImageInput id="1" title="Base" name = "base" src = {userconf.base}/>
//       <ImageInput id="2" title="Sunrise" name="sunrise" src = {userconf.sunrise}/>
//       <ImageInput id="3" title="Day" name="day" src = {userconf.day}/>
//       <ImageInput id="4" title="Twilight" name="twilight" src = {userconf.twilight}/>
//       <ImageInput id="5" title="Night" name="night" src = {userconf.night}/>
//     </div>
// )
}
