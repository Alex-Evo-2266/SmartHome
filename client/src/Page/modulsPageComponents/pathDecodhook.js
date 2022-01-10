import {useCallback} from 'react'

export const useDecodePath = () => {
  const gettext = useCallback((root, path)=>{
    try {
      let p = path.split('.').slice(1)
      let content = root
      for (var item of p) {
        if(item === "")
          continue;
        content = content[item]
      }
      return content
    } catch (e) {
      return null
    }
  },[])

  const getfields = useCallback((field, root)=>{
    if(field.type==="text")
      return field.path
    else if(field.type==="path")
      return gettext(root, field.path)
    else
      return "non"
  },[gettext])

  return {gettext, getfields}
}
