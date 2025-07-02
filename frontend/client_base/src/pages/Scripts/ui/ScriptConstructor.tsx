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
import { ScriptCreate, TypeScriptNode } from '../models/script';
import { Trigger } from './block/trigger';
import { BaseButton, TextField } from 'alex-evo-sh-ui-kit';
import { Start } from './block/start';
import { EditNode, ScriptConstructorEditContext } from '../context/context';
import { Condition } from './block/condition';
import { Action } from './block/action';
import './stype.scss'
import { DialogPortal } from '../../../shared';
import { EditNodeDialog } from './EditNode';
import { useScriptAPI } from '../api/scriptAPI';

const LOCAL_STORAGE_KEY = 'unsaved-script';

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
  const [nodes, setNodes, onNodesChange] = useNodesState<ScriptNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edges>([]);
  const [name, setName] = useState<string>("script")
  const [editHodeDialogVisible, setEditHodeDialogVisible] = useState<EditNode | null>(null)
  const {createScript} = useScriptAPI()

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
    await createScript(script)
  },[nodes, edges, name])

//   useEffect(() => {
//     const data = {
//       nodes,
//       edges,
//     };
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
//   }, [nodes, edges]);

//   useEffect(() => {
//   const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//   if (!saved) return;

//   try {
//     const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);

//     // Проверка: соответствуют ли данные ожидаемой структуре
//     if (Array.isArray(savedNodes) && Array.isArray(savedEdges)) {
//       setNodes(savedNodes);
//       setEdges(savedEdges);
//     }
//   } catch (err) {
//     console.warn("Ошибка при загрузке черновика из localStorage:", err);
//   }
// }, []);

 
  return (
    <ScriptConstructorEditContext.Provider value={{editNode}}>
    <div className='constructor-container'>
      <BaseButton onClick={()=>addNode('trigger')}>add trigger</BaseButton>
      <BaseButton onClick={()=>addNode('condition')}>add condition</BaseButton>
      <BaseButton onClick={()=>addNode('action')}>add action</BaseButton>
      <BaseButton onClick={saveScript}>save</BaseButton>
      <TextField value={name} onChange={changeNameHandler} placeholder="name" border/>
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
    </ScriptConstructorEditContext.Provider>
  );
}

