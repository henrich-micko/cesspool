import { Route, Routes } from "react-router-dom"

// Context
import { AuthProvider } from './context/AuthContext'

// Views
import HomeView from './views/HomeView'
import AccountView from './views/account/AccountView'
import MachineView from "./views/MachineView"
import AdminAccountView from "./views/admin/AccountViewAdmin"
import AdminMachineView from "./views/admin/MachineViewAdmin"
import AccountChangePassword from "@views/account/AccountChangePasswordSubmit"
import AccountActivateView from "@views/account/AccountActivateView"

// Permissions

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <main className="content">
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/account" element={<AccountView />} />
                <Route path="/machine" element={<MachineView />} />
                <Route path="/admin/machine/" element={<AdminMachineView />} />
                <Route path="/admin/account/" element={<AdminAccountView />} />
                <Route path="/account/reset-password/:token" element={<AccountChangePassword />} />
                <Route path="/account/activate/:token" element={<AccountActivateView />} />
            </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
