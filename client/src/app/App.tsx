import { BorderButton, Button, MinButton } from '../shared/ui/Button/Button';
import { TextField } from '../shared/ui/TextField/TextField';
import "../shared/colors.scss"

function App() {

  return (
    <div className="App">
      <div className='test-container'>
        <Button>ergthjm</Button>
        <Button>ergthjm</Button>
        <MinButton>ergthjm</MinButton>
        <BorderButton>fsdg</BorderButton>
      </div>
      <div className='test-container'>
        <TextField placeholder='name'/>
      </div>
    </div>
);
}

export default App
