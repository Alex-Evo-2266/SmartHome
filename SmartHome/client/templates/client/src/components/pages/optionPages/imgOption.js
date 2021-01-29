import React from 'react'
import {ImageInput} from '../../moduls/imageInput'

export const ImgOption = () =>{

  return(
    <div className="configElement img">
      <h3>Background</h3>
      <ImageInput id="1" title="Base" name = "fon-base" src = "/media/fon/fon-base.jpg"/>
      <ImageInput id="2" title="Sunrise" name="fon-sunrise" src = "/media/fon/fon-sunrise.jpg"/>
      <ImageInput id="3" title="Day" name="fon-day" src = "/media/fon/fon-day.jpg"/>
      <ImageInput id="4" title="Twilight" name="fon-twilight" src = "/media/fon/fon-twilight.jpg"/>
      <ImageInput id="5" title="Night" name="fon-night" src = "/media/fon/fon-night.jpg"/>
    </div>
)
}
