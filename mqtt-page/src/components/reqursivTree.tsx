import { TreeProps } from "@/lib/models/types";
import React, { useState } from "react";

const RecursiveTree: React.FC<TreeProps> = ({ data, label, opened}) => {
  const [expanded, setExpanded] = useState(opened ?? false);

  // Ключи, кроме _value
  const childrenKeys = Object.keys(data).filter((key) => key !== "_value");

  const toggle = () => setExpanded(!expanded);

  return (
    <div style={{ marginLeft: label ? 16 : 0 }}>
      {label && (
        <div onClick={toggle} style={{ cursor: "pointer", fontWeight: "bold" }}>
          {expanded ? "▼" : "▶"} {label}: {data._value}
        </div>
      )}

      {!label && <div style={{ fontWeight: "bold" }}>{data._value}</div>}

      {expanded &&
        childrenKeys.map((key) => {
          const child = data[key];
          if (typeof child === "object" && child._value !== undefined) {
            return <RecursiveTree key={key} label={key} data={child} />;
          } else {
            return (
              <div key={key} style={{ marginLeft: 16 }}>
                {key}: {String(child)}
              </div>
            );
          }
        })}
    </div>
  );
};

export default RecursiveTree;
