import React from 'react'
import {ImageInput} from '../../moduls/imageInput'

export const ImgOption = () =>{

  return(
    <div className="configElement img">
      <h3>Background</h3>
      <ImageInput id="1" title="Base" name = "fon-base" src = "http://localhost:5000/api/base/fonImage/base"/>
      <ImageInput id="2" title="Sunrise" name="fon-sunrise" src = "http://localhost:5000/api/base/fonImage/sunrise"/>
      <ImageInput id="3" title="Day" name="fon-day" src = "http://localhost:5000/api/base/fonImage/day"/>
      <ImageInput id="4" title="Twilight" name="fon-twilight" src = "http://localhost:5000/api/base/fonImage/twilight"/>
      <ImageInput id="5" title="Night" name="fon-night" src = "http://localhost:5000/api/base/fonImage/night"/>
    </div>
)
}
