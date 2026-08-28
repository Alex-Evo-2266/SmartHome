import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit";
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from "./routs"
import '../shared/ui/index.scss'
import {AuthManager, AuthProvider} from 'alex-evo-sh-auth'
import { authConfig } from "./config";

const manager = new AuthManager(authConfig)


function App() {


  return (
    <>
      <BrowserRouter>
        <AuthProvider authManager={manager}>
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
