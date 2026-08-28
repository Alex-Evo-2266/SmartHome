import { DataNode } from "alex-evo-web-constructor";


export function dashpoardDataNodeParse(node: DataNode | undefined){

    if(node){
        return node.toString().split('.')
    }
}