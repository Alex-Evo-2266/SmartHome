import React,{useState,useRef} from 'react'
import {NavLink,useLocation} from 'react-router-dom'
import {ImageInput} from '../components/moduls/imageInput'

export const AddMoviePage = () => {
  const imgPoster = useRef(null)
  const divPoster = useRef(null)

  function handleFiles(event) {
    const files = event.target.files
    window.URL = window.URL || window.webkitURL;
    var fileList = divPoster.current

  if (!files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
    return;
  }

  var img = imgPoster.current
  img.src = window.URL.createObjectURL(files[0]);
  img.onload = function() {
    window.URL.revokeObjectURL(this.src);
  }
}

  return(
    <div className = "conteiner files">
      <input type="text" name="title"/>
      <input type="text" name="tagline"/>
      <textarea name="discription" id="" cols="30" rows="10"></textarea>
      <div className="imageInput">
        <label>
          <p>Poster</p>
          <input type="file" name="poster" id="fileElem" accept="image/*" onChange={handleFiles}/>
          <div ref={divPoster} className="fileList">
            <img ref={imgPoster} className="inputImg" alt="poster"/>
          </div>
        </label>
      </div>
      <input type="number" name="year"/>
      <div className="selected-div">
        <select name="regiser" multiple={true}>

        </select>
        <button>Создать</button>
      </div>
      <div className="selected-div">
        <select name="actor" multiple={true}>

        </select>
        <button>Создать</button>
      </div>
      <div className="selected-div multi">
        <select name="ganre" multiple={true}>

        </select>
        <button>Создать</button>
      </div>
      <input type="date"/>
      <input type="number" name="budget"/>
      <input type="number" name="fees_in_usa"/>
      <input type="number" name="fees_in_world"/>
      <div className="selected-div">
        <select name="category">

        </select>
        <button>Создать</button>
      </div>
      <input type="url"/>
      <input type="text"/>
      <input type="text"/>
      <input type="checkbox"/>
    </div>
  )
}
