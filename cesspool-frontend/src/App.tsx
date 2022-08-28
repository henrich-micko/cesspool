import { Route, Routes } from "react-router-dom"

// Components
import TheNaviagtion from './components/TheNaviagtion'

// Context
import { AuthProvider } from './context/AuthContext'

// Views
import HomeView from './views/HomeView'
import LoginView from './views/auth/LoginView'
import RegisterView from "./views/auth/RegisterView"
import AccountView from './views/account/AccountView'
import MachineView from "./views/MachineView"
import AdminView from "./views/admin/AdminView"

// Permissions

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header>
          <TheNaviagtion />
        </header>

        <main className="content">
          <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/account/login" element={<LoginView />}/>
              <Route path="/account/register" element={<RegisterView />} />
              <Route path="/account" element={<AccountView />} />
              <Route path="/machine" element={<MachineView />} />
              <Route path="/admin/:app/" element={<AdminView />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
