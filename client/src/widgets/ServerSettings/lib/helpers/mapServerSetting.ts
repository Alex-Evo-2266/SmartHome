import { ConfigData, ConfigDataItem } from "../../models/serverConfig"

const dictToList = (dict: Dict<string>):ConfigDataItem[]=>{
	let arr:ConfigDataItem[] = []
	for (const key in dict) {
		arr.push({name: key, value: dict[key]})
	}
	return arr
}

export const mapServerSettingsToList = (dict:Dict<Dict<string>>):ConfigData[] => {
    let arr: ConfigData[] = []
    for (const key in dict) {
        arr.push({name: key, content: dictToList(dict[key])})
    }
    return arr
}

const ListToDict = (list: ConfigDataItem[])=>{
	let dict:Dict<string> = {}
	for (const item of list) {
		dict[item.name] = item.value
	}
	return dict
}

export const mapServerSettingsToDict = (list:ConfigData[]):Dict<Dict<string>> => {
	let dict: Dict<Dict<string>> = {}
	for (const item of list) {
		dict[item.name] = ListToDict(item.content)
	}
	return dict
}