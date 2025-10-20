
import React, { useState, useRef } from "react";

const HighlightTextarea = ({ words, suggestions }) => {
  const [text, setText] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const divRef = useRef(null);

  function getCursorPosition(parent) {
    let selection = document.getSelection()
    let range = new Range
    range.setStart(parent, 0)
    range.setEnd(selection.anchorNode, selection.anchorOffset)
    return range.toString().length
  }
  
  function setCursorPosition(parent, position) {
    let child = parent.firstChild
    while(position > 0) {
      let length = child.textContent.length
      if(position > length) {
        position -= length
        child = child.nextSibling
      }
      else {
        if(child.nodeType == 3) return document.getSelection().collapse(child, position)
        child = child.firstChild
      }
    }
  }

  const handleInput = (e) => {
    const range = getCursorPosition(e.target)
    const value = e.target.innerText
    setText(value);

    setTimeout(()=>setCursorPosition(e.target, range), 0)
  };

  const highlightText = (text) => {
    const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");    
    return text.replaceAll('\n', `<br/>`).replaceAll(regex, (match) => `<span style='color: yellow;'>${match}</span>`)
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        role="textbox"
        translate="no"
        dangerouslySetInnerHTML={{ __html: highlightText(text) }}
        style={{
          width: "100%",
          minHeight: "100px",
          border: "1px solid #ccc",
          padding: "5px",
          outline: "none",
        }}
      />
     
    </div>
  );
};


// Пример использования компонента DeviceCard
export const Example = () => {


  return <HighlightTextarea 
  words={["react", "useState", "component"]} 
  suggestions={["useEffect", "useCallback", "component.method"]} 
/>;
};
