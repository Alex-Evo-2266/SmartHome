import React from 'react'
import {SelectioEnlementImg} from '../../addDeviceComponent/selectioEnlementImg'
import imgLight from '../../../img/lightDevices.jpg';
import imgDimmer from '../../../img/dimmerDevices.jpg';
import imgOther from '../../../img/otherDevice.jpg';
import imgSensor from '../../../img/sensorDevices.jpg';
import imgSwitch from '../../../img/switchDevices.jpg';

export const ChoiceType = ({hide})=>{

  const typeDeviceHandler = event => {
      hide(event.target.title)
  }

  return(
    <div className = "form small">
    <div className="editDevicesForm" >
      <h2>Chioce type</h2>
      <ul className="selectioEnlementUl">
      <li>
        <SelectioEnlementImg onClick={typeDeviceHandler} width="100px" height="100px" title = "light device" name="light" src={imgLight}/>
      </li>
      <li>
        <SelectioEnlementImg onClick={typeDeviceHandler} width="100px" height="100px" title="relay device" name="relay" src={imgSwitch}/>
      </li>
      <li>
        <SelectioEnlementImg onClick={typeDeviceHandler} width="100px" height="100px" title = "dimmer device" name="dimmer" src={imgDimmer}/>
      </li>
      <li>
        <SelectioEnlementImg onClick={typeDeviceHandler} width="100px" height="100px" title="sensor device" name="sensor" src={imgSensor}/>
      </li>
      <li>
        <SelectioEnlementImg onClick={typeDeviceHandler} width="100px" height="100px" title="other device" name="other" src={imgOther}/>
      </li>
      </ul>
    </div>
    </div>
  )
}
