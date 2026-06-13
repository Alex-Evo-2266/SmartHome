import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit";
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from "./routs"
import '../shared/ui/index.scss'
import {AuthProvider} from 'alex-evo-sh-auth'
import { authConfig } from "./config";


function App() {


  return (
    <>
      <BrowserRouter>
        <AuthProvider authConfig={authConfig}>
          <ColorProvider>
            <SizeProvider>
              <RoutesComponent/>
            </SizeProvider>
          </ColorProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
