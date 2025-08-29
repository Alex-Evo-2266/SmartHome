import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Roles from "./pages/Roles";
import Privileges from "./pages/Privileges";
import { ADD_USER } from "./const";
import SessionPage from "./pages/Sessions";

const { Header, Content } = Layout;

function AppLayout() {
  const { user, logout } = useAuth();

  console.log(user)

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          {user && (
            <>
              <Menu.Item key="1"><Link to="/users">Пользователи</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/roles">Роли</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/privileges">Права</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/sessions">Сессии</Link></Menu.Item>
              <Menu.Item key="10" onClick={logout}>Выйти</Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Routes>
          {
            user?
            <>
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
              <Route path="/privileges" element={<ProtectedRoute><Privileges /></ProtectedRoute>} />
              <Route path="/sessions" element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
              {
                <Route path="/users/add" element={<ProtectedRoute prev={ADD_USER}><AddUser /></ProtectedRoute>} />
              }
              <Route path="/*" element={<Navigate replace to="/users" />} />
            </>:
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<Navigate replace to="/login" />} />
            </>
          }
        </Routes>
      </Content>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
