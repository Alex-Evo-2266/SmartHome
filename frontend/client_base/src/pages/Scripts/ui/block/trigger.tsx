import { Handle, Position } from '@xyflow/react';
import { IconButton, Panel, Pen, Typography } from "alex-evo-sh-ui-kit"
import { useContext } from "react";

import { EditNode, ScriptConstructorEditContext } from "../../context/context";

export const Trigger = (props:{data: {label: string, node: EditNode}}) => {

    const {editNode} = useContext(ScriptConstructorEditContext)

    return(
        <Panel>
            <Typography type="body" style={{display: 'block'}}>{props.data.label}</Typography>
            <Typography type="small">{props.data.node.expression}</Typography>
            <div>
                <IconButton size='small' icon={<Pen/>} onClick={()=>editNode(props.data.node)}/>
            </div>
            <Handle type="source" position={Position.Bottom} id="true" />
        </Panel>
    )
}