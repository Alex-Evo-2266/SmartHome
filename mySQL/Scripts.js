const mysql = require('mysql2')
const config = require('config');

let conection;
module.exports.connect = ()=>{
  conection = mysql.createPool(config.get('sqlConfDef')).promise();
}
module.exports.desconnect = async function(){
  await conection.end((err)=>{
    console.error('errr2',err.message);
  })
}

const idEmpty = (elements)=>{
  let b = false;
  for (let i = 1; i <= elements.length+1; i++) {
    b = false

    for (let j = 0; j < elements.length; j++) {
      if(elements[j].ScriptId==i){
        b=true;
        break;
      }
    }
    if(!b) return i;
  }
  return 1;
}

const scripts = async()=>{
  try {
    const result = await conection.execute(`SELECT * FROM smarthome_scripts`)
    if(result&&result[0]){
      for (var item of result[0]) {
        item.ScriptTrigger = JSON.parse(item.ScriptTrigger)
        item.ScriptIf = JSON.parse(item.ScriptIf)
        item.ScriptThen = JSON.parse(item.ScriptThen)
        item.ScriptElse = JSON.parse(item.ScriptElse)
      }
    }
    return result[0];

  } catch (e) {
    console.error();("Error",e);
    return ;
  }
}
module.exports.Scripts = scripts;

const script = async(id)=>{
  try {
    const result = await conection.execute(`SELECT * FROM smarthome_scripts WHERE ScriptId = ${id}`)
    if(result&&result[0][0]){
      result[0][0].ScriptTrigger = JSON.parse(result[0][0].ScriptTrigger)
      result[0][0].ScriptIf = JSON.parse(result[0][0].ScriptIf)
      result[0][0].ScriptThen = JSON.parse(result[0][0].ScriptThen)
      result[0][0].ScriptElse = JSON.parse(result[0][0].ScriptElse)
    }
    return result[0][0];

  } catch (e) {
    console.error("Error",e);
    return;
  }
}

module.exports.Script = script;

module.exports.addScript = async function(data){
  try {
    if(!data.id){
      data.id = idEmpty(await scripts());
    }
    if(!data.name||!data.then) return;

    if(!data.status)data.status = "trigger"
    if(!data.trigger||!data.trigger[0])data.status = "manual"
    if(!data.if){
      data.status = "manual"
      data.if = {}
    }
    if(!data.else)data.else = [];
    await conection.execute(
      "INSERT INTO `smarthome_scripts`(`ScriptId`, `ScriptName`, `ScriptStatus`, `ScriptTrigger`, `ScriptIf`, `ScriptThen`, `ScriptElse`) VALUES (?,?,?,?,?,?,?)",
      [data.id, data.name,data.status,data.trigger, data.if, data.then, data.else]
    )

    return true;
  }
  catch (e) {
    console.error("Error",e);
    return
  }
}
module.exports.lookForScriptByName = async function (name) {
  try {
    const result = await conection.execute(`SELECT * FROM smarthome_scripts WHERE ScriptName = '${name}'`)
    return result[0];
  } catch (e) {
    console.error("Error",e);
    return
  }
}

module.exports.lookForScriptByStatus = async function (status) {
  try {
    const result = await conection.execute(`SELECT * FROM smarthome_scripts WHERE ScriptStatus = '${status}'`)
    if(result&&result[0]){
      for (var item of result[0]) {
        item.ScriptTrigger = JSON.parse(item.ScriptTrigger)
        item.ScriptIf = JSON.parse(item.ScriptIf)
        item.ScriptThen = JSON.parse(item.ScriptThen)
        item.ScriptElse = JSON.parse(item.ScriptElse)
      }
    }
    return result[0];
  } catch (e) {
    console.error("Error",e);
    return
  }
}

module.exports.lookForScriptByDevice = async function (id) {
  const ifScan = async(content,scriptId)=>{
    if(!content.ifElement)return
    for await(var item2 of content.ifElement) {
      if(item2.type==="ifClass"&&item2.subif&&item2.subif.DeviseId===id){
        await deleteScript(scriptId)
      }
      if(item2.type==="groupIfClass"){
        ifScan(item2.subif,scriptId)
      }
      console.log(item2);
    }
  }
  try {
    let arr = await scripts()
    if(!arr)return
    for await(var item of arr) {
      for await(var item2 of item.ScriptTrigger) {
        if(item2.DeviseId===id)
          await deleteScript(item.ScriptId)
      }
      for await(var item2 of item.ScriptThen) {
        if(item2.DeviseId===id)
          await deleteScript(item.ScriptId)
        if(item2.value&&item2.value.type==="DeviseValue"&&item2.value.value&&item2.value.value.DeviceId===id)
          await deleteScript(item2.value.value.DeviceId)
      }
      for await(var item2 of item.ScriptElse) {
        if(item2.DeviseId===id)
          await deleteScript(item.ScriptId)
        if(item2.value&&item2.value.type==="DeviseValue"&&item2.value.value&&item2.value.value.DeviceId===id)
          await deleteScript(item2.value.value.DeviceId)
      }
      if(item.ScriptIf){
        await ifScan(item.ScriptIf,item.ScriptId)
      }
    }
    // return result[0];
  } catch (e) {
    console.error("Error",e);
    return
  }
}

 const deleteScript = async function(id){
  try {
    if(!id){
      return;
    }
    await conection.execute(
      "DELETE FROM `smarthome_scripts` WHERE `ScriptId`= ?" ,
      [id]
    )

    return true;
  }
  catch (e) {
    console.error("Error",e);
    return
  }
}

module.exports.deleteScript = deleteScript

const setStatus = async function (id,value) {
  try {
    if(!id||!value)
      return
    await conection.execute(
      "UPDATE `smarthome_scripts` SET `ScriptStatus`=? WHERE `ScriptId`=?" ,
      [value, id]
    )
    return true;
  }
  catch (e) {
    console.error("Error",e);
    return
  }
}

module.exports.setStatus = setStatus
