const { Router } = require('express');
const express = require('express');
const router = Router();
const config = require('config');
const auth = require('../middleware/auth.middleware')
const {check, validationResult} = require('express-validator')
const devices = require('../mySQL/Devices');
const mqtt = require('../mqtt/mqtt');
const deleteElFromHomePage = require('../sort/deleteDeviceFromHomePage')

router.post('/add',
  [
    check('name', "wrong name device").isLength({min:2}),
    check('typeConnect', "wrong type connect").isLength({min:3}),
    check('typeDevice', "error input data").isLength({min:2})
  ],
  auth,
  async (req, res)=> {
   try {
     console.log(req.body);
     //---------------------validation--------------------//
           const errors = validationResult(req);
           if(!errors.isEmpty()){
             return res.status(400).json({
               errors: errors.array(),
               message: 'wrong input data'
             })
           }
     //---------------------------------------------------//
     const {name, typeConnect, typeDevice,systemName, config} = req.body;
     await devices.connect();
     const condidate = await devices.lookForDeviceByName(name)
     if(condidate.length !== 0){
       throw new Error("device with the same name already exists.")
     }
     const condidate2 = await devices.lookForDeviceBySystemName(req.body.DeviceSystemName)
     if(condidate2&&condidate2[0]&&condidate2[0].DeviceId!==req.body.DeviceId){
       throw new Error("device with the same system name already exists.")
     }
     await devices.addDevice({
       name,
       systemName,
       typeDevice,
       typeConnect,
       config
     })
     await devices.desconnect();
     mqtt.desconnect()
     mqtt.connect()
     return res.status(201).json({message: "ok"})
   }
   catch(e){
     console.log("Error AddDevices",e);
     return res.status(500).json({message: e.message})
   }
 })
 router.get('/all',auth,async (req, res)=>{
   try {
     await devices.connect();
     res.status(201).json(await devices.Devices())
     await devices.desconnect();
     return
   } catch (e) {
     console.log("Error AddDevices",e);
     return res.status(500).json({message: e.message})
   }
 })

 router.get('/get/:id',auth,async (req, res)=>{
   try {
     await devices.connect();
     res.status(201).json(await devices.Device(req.params.id))
     await devices.desconnect();
     return
   } catch (e) {
     console.log("Error AddDevices",e);
     return res.status(500).json({message: e.message})
   }
 })

 router.post('/edit',auth,async (req, res)=>{
   console.log(req.body);
   try {
     await devices.connect();
     const condidate = await devices.lookForDeviceByName(req.body.DeviceName)
     if(condidate&&condidate[0]&&condidate[0].DeviceId!==req.body.DeviceId){
       throw new Error("device with the same name already exists.")
     }
     const condidate2 = await devices.lookForDeviceBySystemName(req.body.DeviceSystemName)
     if(condidate2&&condidate2[0]&&condidate2[0].DeviceId!==req.body.DeviceId){
       throw new Error("device with the same system name already exists.")
     }
     await devices.updataDevice({
       id:req.body.DeviceId,
       name:req.body.DeviceName,
       systemName:req.body.DeviceSystemName,
       info:req.body.DeviceInformation,
       idRoom:req.body.RoomId||0,
       typeConnect:req.body.DeviceTypeConnect,
       typeDevice:req.body.DeviceType,
       config:req.body.DeviceConfig||{}
     })
     if(req.body.DeviceValue){
       await devices.setValue(req.body.DeviceId,"value",req.body.DeviceValue)
     }
     await devices.desconnect();
     res.status(201).json({message:"ok"})
     mqtt.desconnect()
     mqtt.connect()
     return
   } catch (e) {
     console.log("Error AddDevices",e);
     return res.status(500).json({message: e.message})
   }
 })

 router.post('/delete',auth,async (req, res)=>{
   try {
     const {DeviceId} = req.body
     await devices.connect();
     res.status(201).json(await devices.deleteDevice(DeviceId))
     await devices.desconnect();
     deleteElFromHomePage(DeviceId)
     return
   } catch (e) {
     console.log("Error AddDevices",e);
     return res.status(500).json({message: e.message})
   }
 })

module.exports = router;
