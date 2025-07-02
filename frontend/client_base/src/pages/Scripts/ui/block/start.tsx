import { Panel } from "alex-evo-sh-ui-kit"
import { Handle, Position } from '@xyflow/react';

export const Start = () => {

    return(
        <Panel>
            Start
            <Handle type="source" position={Position.Bottom} id="true" />
        </Panel>
    )
}