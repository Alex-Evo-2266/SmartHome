var mqtt = require('mqtt')
const serverConfig = require('../serverConfig/config')
const devices = require('../mySQL/Devices');


let client
const connect = ()=>{
  client = mqtt.connect(`mqtt://${serverConfig.mqttBroker}`,{username:serverConfig.loginMqttBroker,password:serverConfig.passwordMqttBroker})
  client.on('connect', function () {
    console.log("mqtt connected");
    return true;
  })
  client.on('error',function (er) {
    console.log("error",er);
  })
  client.on('reconnect',function (er) {
    console.log("reconnect",er);
  })
  subscribe('test')
  input()
  subscribeDevicesStatus()
}
module.exports.connect = connect

const subscribe = (topik)=>{
  client.subscribe(topik, function () {
    console.log("connect topic",topik);
  })
}
module.exports.subscribe = subscribe

const public = (topic, mes)=>{
  client.publish(topic, mes)
}
module.exports.public = public

const input = (ret)=>{
  client.on('message', function (topic, message) {
    // message is Buffer
    updataValueDevices(topic,message.toString())
  })
}

/*
  {"value":"true","battary":"50"}
*/

const updataValueDevices = async(topic,mes)=>{
  try {
    await devices.connect()
    const elements = await devices.lookForDeviceByTopic(topic)
    if(!elements)return
    for(let item of elements) {
      if(item.key==="status"){
        mes = JSON.parse(mes)
        // console.log(mes);
        if(item.type==="binarySensor"){
          if(!mes.value||mes.value==="false"||mes.value==="0"||mes.value==="off"||mes.value==="Off"||mes.value==="OFF")
            mes.value = "0"
          else
            mes.value = "1"
        }
      }
      let value = mes||"0"
      await devices.setValue(item.deviceId,item.key,value)
    }
    await devices.desconnect();
  } catch (e) {
    console.error(e);
  }

}

const desconnect = ()=>{
  client.end()
  console.log("mqtt desconnect");
}
module.exports.desconnect = desconnect

const subscribeDevicesStatus = async()=>{
  try {
    await devices.connect()
    const devicesList = await devices.Devices()
    await devices.desconnect();

    for (let i = 0; i < devicesList.length; i++) {
      if (devicesList[i].DeviceConfig.status) {
        subscribe(devicesList[i].DeviceConfig.status)
      }
      if(devicesList[i].DeviceConfig.power){
        subscribe(devicesList[i].DeviceConfig.power)
      }
      if(devicesList[i].DeviceConfig.dimmer){
        subscribe(devicesList[i].DeviceConfig.dimmer)
      }
      if(devicesList[i].DeviceConfig.lavelLight){
        subscribe(devicesList[i].DeviceConfig.lavelLight)
      }
      if(devicesList[i].DeviceConfig.color){
        subscribe(devicesList[i].DeviceConfig.color)
      }
      if(devicesList[i].DeviceConfig.mode){
        subscribe(devicesList[i].DeviceConfig.mode)
      }
    }
  } catch (e) {
    console.error("error",e);
  }
}
