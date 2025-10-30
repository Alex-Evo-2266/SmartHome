import { Handle, Position } from '@xyflow/react';
import { IconButton, Panel, Pen, Typography } from "alex-evo-sh-ui-kit"
import { useContext } from "react";

import { EditNode, ScriptConstructorEditContext } from "../../context/context";


const WIDTH = 200
const PADING = 16
const MARGIN_DOT = 40
const REAL_WIDTH = WIDTH - (PADING * 2)

export const Condition = (props:{data: {label: string, node: EditNode}}) => {
    const {editNode} = useContext(ScriptConstructorEditContext)

    return(
        <Panel style={{width: REAL_WIDTH}}>
            <Typography type="body" style={{display: 'block'}}>{props.data.label}</Typography>
            <Typography type="small">{props.data.node.expression}</Typography>
            
            <div>
                <IconButton size='small' icon={<Pen/>} onClick={()=>editNode(props.data.node)}/>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: MARGIN_DOT - 10 }}>True</div>
            <div style={{ position: 'absolute', bottom: 0, left: WIDTH - MARGIN_DOT - 10 }}>False</div>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom} id="true" style={{left: MARGIN_DOT}}/>
            <Handle type="source" position={Position.Bottom} id="false" style={{left: WIDTH - MARGIN_DOT}}/>
        </Panel>
    )
}