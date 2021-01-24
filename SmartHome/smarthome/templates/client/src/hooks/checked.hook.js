
export const useChecked = () => {
  const USText = str =>{
    const simbol = "1234567890_qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
    for (var i = 0; i < str.length; i++) {
      let p = false;
      for (var j = 0; j < simbol.length; j++) {
        if(simbol[j]===str[i]){
          p=true;
          break;
        }
      }
      if(!p){
        return false;
      }
    }
    return true;
  }
  return{USText}
}
