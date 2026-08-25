import { TreeNodeModel, TreeNodeRenderProps } from 'alex-evo-tree';
import './style.scss'

type DashboardTreeNodeProps = {
    node: TreeNodeModel;
    drag: TreeNodeRenderProps,
    selected?: boolean;
    expanded?: boolean;
    onClick?: () => void;
};

export const DashboardTreeNode = ({
    node,
    drag,
    selected = false,
    // expanded = false,
    onClick,
}: DashboardTreeNodeProps) => {
    const hasChildren = node.children !== undefined
    return (
        <div
            className={[
                "dashboard-tree-node",
                selected && "dashboard-tree-node--selected",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={onClick}
        >
            <div 
                className="dashboard-tree-node__drag"
                ref={drag.dragHandleRef}
                {...drag.dragListeners}
                {...drag.dragAttributes}
            >
                ⠿
            </div>

            {/* {hasChildren && (
                <div className="dashboard-tree-node__expand">
                    {expanded ? "▾" : "▸"}
                </div>
            )} */}
            {
                hasChildren?
                <div className="dashboard-tree-node__icon">
                    ▦
                </div>:
                <div className="dashboard-tree-node__icon">
                    ◈
                </div>
            }



            <div className="dashboard-tree-node__content">
                <div className="dashboard-tree-node__title">
                    {node.title}
                </div>
                {node.type && (
                    <div className="dashboard-tree-node__type">
                        {node.type}
                    </div>
                )}
            </div>
{/* 
            <button
                className="dashboard-tree-node__menu"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                ⋮
            </button> */}
        </div>
    );
};