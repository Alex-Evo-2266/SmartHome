import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import { ScriptCreate, TypeScriptNode } from '../../../entites/script/models/script';
import { Trigger } from './block/trigger';
import { BaseButton, FAB, Plus, SelectionDialog, TextField } from 'alex-evo-sh-ui-kit';
import { Start } from './block/start';
import { EditNode, ScriptConstructorEditContext } from '../context/context';
import { Condition } from './block/condition';
import { Action } from './block/action';
import { useParams, useNavigate } from 'react-router-dom';
import './stype.scss'
import { DialogPortal } from '../../../shared';
import { EditNodeDialog } from './EditNode';
import { useScriptAPI } from '../../../entites/script/api/scriptAPI';

interface ScriptNode{
  id:string,
  position: { 
    x: number,
    y: number
  },
  data: {
    label: string,
    node: EditNode
  },
  type: "trigger" | "start" | "action" | "condition",
  deletable?: boolean
}

const initialNodes:ScriptNode[] = [
  {id:"start", position: {x: 0, y: 0}, data: {label: "start", node: {type: TypeScriptNode.Start, expression:"", description:"", id: "start"}}, type: 'start', deletable: false}
];

interface Edges {
  id: string,
  source: string,
  target: string,
  sourceHandle: string
}

const toScript = (nodes:ScriptNode[], edges:Edges[], name: string): ScriptCreate => {
  return {
    name,
    description: "Auto generated",
    nods: nodes
      .filter(n => n.data.node)
      .map(n => ({
        id: n.id,
        type: n.data.node!.type,
        expression: n.data.node!.expression,
        description: n.data.node!.description,
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
      })),
    edgs: edges.map(e => ({
      id: e.id,
      id_start: e.source,
      id_end: e.target,
      condition_label: e.sourceHandle,
    }))
  };
};


export const ScriptConstructor: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const [nodes, setNodes, onNodesChange] = useNodesState<ScriptNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edges>([]);
  const [name, setName] = useState<string>("script")
  const [editHodeDialogVisible, setEditHodeDialogVisible] = useState<EditNode | null>(null)
  const {createScript, getScript, editScript} = useScriptAPI()
  const navigate = useNavigate()
  const [selectNodeDialogVisible, setSelectNodeDialogVisible] = useState<boolean>(false)

  const loadScript = useCallback(async()=>{
    if(!id)return;
    const script = await getScript(id)
    const loadedNodes: ScriptNode[] = script.nods.map((node) => ({
    id: node.id,
    type: node.type.toLowerCase() as ScriptNode["type"], // Преобразуем к нужному формату типа
    position: {
      x: node.x,
      y: node.y,
    },
    data: {
      label: node.type.toLowerCase(),
      node: {
        id: node.id,
        type: node.type,
        expression: node.expression,
        description: node.description ?? "",
      },
    },
    deletable: node.id !== "start", // Старт не должен быть удаляемым
  }));

  const loadedEdges: Edges[] = script.edgs.map((edge) => ({
    id: edge.id,
    source: edge.id_start,
    target: edge.id_end,
    sourceHandle: edge.condition_label,
  }));

  setNodes(loadedNodes);
  setEdges(loadedEdges);
  setName(script.name)
  },[id, getScript])

  const nodeTypes = {trigger: Trigger, start: Start, condition: Condition, action: Action}
 
  const onConnect = useCallback(
    (params: Connection) => {
      const { source, target } = params;
      if (!source || !target) return;

      // Запрещаем loop edges сразу
      if (source === target) {
        console.warn("Нельзя соединить узел сам с собой");
        return;
      }

      // Построение adjacency list
      const graph: Record<string, string[]> = {};
      edges.forEach((edge) => {
        if (!graph[edge.source]) graph[edge.source] = [];
        graph[edge.source].push(edge.target);
      });

      // Проверка: существует ли путь от `target` к `source`
      const hasPath = (from: string, to: string, visited = new Set<string>()): boolean => {
        if (from === to) return true;
        if (visited.has(from)) return false;

        visited.add(from);

        const neighbors = graph[from] || [];
        return neighbors.some((next) => hasPath(next, to, visited));
      };

      if (hasPath(target, source)) {
        console.warn("Добавление этого ребра создаст цикл — запрещено");
        return;
      }

      // OK — добавляем
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const addNode = (type: "trigger" | "action" | "condition") => {
    const id = uuidv4()
    const typeNode = type === "trigger"? TypeScriptNode.TRIGGER: type === "condition"? TypeScriptNode.CONDITION: TypeScriptNode.ACTION
    setNodes(prev=>[...prev, {
      id: id, 
      data:{
        node:{
          id:id, 
          expression: "", 
          description: "", 
          type: typeNode
        }, 
        label: type
      }, 
      type: type, 
      position:{ 
        x: Math.random(), 
        y: Math.random() 
      }
    }])
    setSelectNodeDialogVisible(false)
  }

  const editNode = (data: EditNode) => {
    setEditHodeDialogVisible(data)
  }

  const formatNode = (data:ScriptNode, expression:string):ScriptNode => {
    return ({...data, data: {...data.data, node: {...data.data.node, expression}}})
  }

  const saveEditNode = (data:EditNode) => {
    setNodes(prev=>{
      return prev.map(item=>item.id === data.id?formatNode(item, data.expression):item)
    })
    setEditHodeDialogVisible(null)
  }

  const changeNameHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const saveScript = useCallback(async()=>{
    const script = toScript(nodes, edges, name)
    if(id){
      await editScript(id, script)
    }
    else{
      await createScript(script)
    }
    navigate("/automation")
  },[nodes, edges, name, id])

  const items = [
    {
      title: "trigger",
      data: "trigger"
    },
    {
      title: "condition",
      data: "condition"
    },
    {
      title: "action",
      data: "action"
    }
  ] as const

  useEffect(()=>{
    loadScript()
  },[loadScript])
 
  return (
    <ScriptConstructorEditContext.Provider value={{editNode}}>
    <div className='constructor-container'>
      <div className='constructor-script-control'>
        <TextField styleContainer={{height: "64px"}} value={name} onChange={changeNameHandler} placeholder="name" border/>
        <BaseButton style={{height: "64px", borderRadius: "10px"}} onClick={saveScript}>save</BaseButton>
      </div>
      <ReactFlow
        className='drow-container'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
    {
      editHodeDialogVisible &&
      <DialogPortal>
        <EditNodeDialog onSave={saveEditNode} data={editHodeDialogVisible} onHide={()=>setEditHodeDialogVisible(null)}/>
      </DialogPortal>
    }
    {
      selectNodeDialogVisible &&
      <DialogPortal>
        <SelectionDialog header="Select node" items={[...items]} onSuccess={addNode} onHide={()=>setSelectNodeDialogVisible(false)}/>
      </DialogPortal>
    }
    <FAB icon={<Plus/>} onClick={()=>setSelectNodeDialogVisible(true)}/>
    </ScriptConstructorEditContext.Provider>
  );
}

